/** @format */

import { Divide, query } from "faunadb";

import { GetMinimalUser } from "../user/read";

const {
  Call,
  Create,
  Collection,
  CurrentIdentity,
  Paginate,
  Documents,
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
  Update,
  Do,
  Add,
  Subtract,
  Not,
  Contains,
  Abort,
  Now,
  Map
} = query;


function GetComment(ref) {
  return Let(
    {
      comment: Get(ref),
    },
    [
      Select(["data", "created"], Var("comment")),
      Select(["data", "message"], Var("comment")),
      Select(["data", "author"], Var("comment")),
      Select(["data", "stats", "likes"], Var("comment")),
      Select(["data", "stats", "comments"], Var("comment")),
      Select(["ref"], Var("comment")),
      Select(["ts"], Var("comment")),
    ]
  )
}


export function GetContentComments(parentRef, afterRef) {
  return (
    Map(
      Paginate(
        Join(
          Match(Index('comments_by_parent'), parentRef),
          Index("comments_sorted_created")
        ),
        {
          size: 2,
          after: afterRef !== null && GetComment(afterRef)
        }
      ),
      Lambda(["created", "message", "author", "likes", "comments", "ref", "ts"],
        Let(
          {
            author: GetMinimalUser(Var("author"))
          },
          {
            faunaRef: Var("ref"),
            message: Var("message"),
            author: Var("author"),
            created: Var("created"),
            updated: Divide(Var("ts"), 1000),
            stats: { likes: Var("likes"), comments: Var("comments") },
          }
        ))
    )
  )
}
