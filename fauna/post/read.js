/** @format */
import { query } from "faunadb";

import { GetContentComments } from "../comment/read";
import { GetMinimalUser, GetViewerRef } from "../user/read";

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

export function GetArticle(
  articleRef,
  withAuthor = true,
  comments = 3,
  withViewerStats = false
) {
  return Let(
    {
      article: Get(articleRef),

      authorRef: Select(["data", "authorRef"], Var("article")),
      author: withAuthor ? GetMinimalUser(Var("authorRef")) : {},
      comments: GetContentComments(articleRef, "article", comments),

      viewerRef: withViewerStats ? GetViewerRef() : null,

      viewerArticleStatsMatch: withViewerStats
        ? Match(
          Index("stats_by_articleRef_and_userRef"),
          Var("viewerRef"),
          articleRef
        )
        : null,
      viewerArticleStats: withViewerStats
        ? If(
          Exists(Var("viewerArticleStatsMatch")),
          Get(Var("viewerArticleStatsMatch")),
          {}
        )
        : null,

      viewerArticleStats: Var("viewerArticleStats"),
    },
    {
      article: Var("article"),
      author: Var("author"),
      comments: Var("comments"),
      viewerArticleStats: Var("viewerArticleStats"),
    }
  );
}
