/** @format */

import { query } from "faunadb";

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
} = query;

export function GetCommentWithMinimalAuthor(commentRef) {
  return Let(
    {
      comment: Get(commentRef),

      authorRef: Select(["data", "authorRef"], Var("comment")),
      author: GetMinimalUser(Var("authorRef")),
    },
    {
      author: Var("author"),
      comment: Var("comment"),
    }
  );
}

export function GetCommentsWithMinimalAuthor(commentRefs) {
  return query.Map(
    commentRefs,
    Lambda(["created", "ref", "message", "coins", "authorRef"],
      Let(
        {
          author: GetMinimalUser(Var("authorRef"))
        },
        {
          ref: Var("ref"),
          message: Var("message"),
          coins: Var("coins"),
          author: Var("author"),
          created: Var("created"),
        }
      ))
  );
}

export function GetContentComments(contentRef, docType) {
  return GetCommentsWithMinimalAuthor(
    Paginate(
      Join(
        Match(Index(`comments_by_${docType}Ref`), contentRef),
        Index("comments_sorted_created")
      )
    )
  );
}
