/** @format */
import { query } from "faunadb";
import { GetMinimalContentWithoutAuthor } from "../content/read";
import { GetContentCreatedAfterCursor } from './../content/read';

const {
  CurrentIdentity,
  Paginate,
  Lambda,
  Get,
  Var,
  Select,
  Let,
  Match,
  Index,
  Join,
  If,
  Exists,
  Map
} = query;

export function GetUserRefByUsername(username) {
  return Select([0], Paginate(Match(Index("user_by_username"), username)));
}

export function GetUserRefByAccountConnection(accountConnection) {
  return Select(
    [0],
    Paginate(Match(Index("userRef_by_accountConnection"), accountConnection))
  );
}

export function GetViewerRef() {
  return GetUserRefByAccountConnection(CurrentIdentity());
}

export function GetViewer() {
  return Get(GetViewerRef());
}

export function GetMinimalUser(userRef) {
  return Let(
    {
      user: Get(userRef),
    },
    {
      username: Select(["data", "username"], Var("user")),
      name: Select(["data", "name"], Var("user")),
      picture: Select(["data", "picture"], Var("user")),
    }
  );
}

export function GetUserWithContent(username, afterRef) {
  return Let(
    {
      userRefMatch: Match(Index("user_by_username"), username),

      userRef: If(Exists(Var("userRefMatch")), Select(
        [0],
        Paginate(Var("userRefMatch"))
      ), false),

      user: If(Exists(Var("userRefMatch")), Get(Var("userRef")), false),
      content: If(Exists(Var("userRefMatch")), Map(
        Paginate(
          Join(
            Match(Index("content_by_author"), Var("userRef")),
            Index("content_sorted_created")
          ),
          {
            size: 20,
            after: afterRef != null && GetContentCreatedAfterCursor(afterRef)
          }
        ),
        Lambda(["created", "ref"], GetMinimalContentWithoutAuthor(Var("ref")))), false),
    },
    {
      user: Var("user"),
      content: Var("content"),
    })
}
