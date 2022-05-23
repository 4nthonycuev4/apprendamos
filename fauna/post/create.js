/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "../user/read";

const { Get, Var, Collection, Let, Select, Create, Now, Update, Do, Add } =
  query;

export function CreateArticle(body, tags) {
  return Let(
    {
      authorRef: GetViewerRef(),
      author: Get(Var("viewerRef")),

      article: Create(Collection("articles"), {
        data: {
          body,
          tags,
          authorRef: Var("authorRef"),
          created: Now(),
          stats: {
            likes: 0,
            saved: 0,
            comments: 0,
          },
        },
      }),
    },
    Do(
      Update(Var("authorRef"), {
        data: {
          stats: {
            articles: Add(Select(["data", "stats", "articles"], Var("author")), 1),
          },
        },
      }),
      Select(["ref"], Var("article"))
    )
  );
}
