/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "../users/read";

const {
  Create,
  Collection,
  Get,
  Var,
  Select,
  Let,
  Match,
  Index,
  If,
  Exists,
  Update,
  Do,
  Add,
  Now,
} = query;

export function CreateComment(contentRef, message) {
  return Let(
    {
      viewerRef: GetViewerRef(),
      viewer: Get(Var("viewerRef")),

      contentStatsRefMatch: Match(
        Index('contentstats_by_user'),
        contentRef,
        Var("viewerRef"),
      ),

      content: Get(contentRef),

      authorRef: Select(["data", "author"], Var("content")),
      author: Get(Var("authorRef")),

      authorStatsMatch: Match(
        Index("authorstats_by_user"),
        Var("authorRef"),
        Var("viewerRef")
      ),

      authorStats: If(Exists(Var("authorStatsMatch")), Get(Var("authorStatsMatch")), false),

      comment: Create(
        Collection('comments'),
        {
          data: {
            message,
            author: Var("viewerRef"),
            parent: contentRef,
            created: Now(),
            stats: {
              likeCount: 0,
              dislikeCount: 0,
              commentCount: 0
            },
            updated: null
          },
        }
      ),
    },
    Do(
      If(
        Exists(Var("authorStatsMatch")),
        Update(
          Select(["ref"], Var("authorStats")),
          {
            data: {
              stats: {
                commentCount: Add(
                  Select(["data", "commentCount"], Var("authorStats")),
                  1
                ),
              }
            },
          }
        ),
        Create(Collection("authorstats"), {
          data: {
            user: Var("viewerRef"),
            author: Var("authorRef"),
            following: false,
            viewCount: 0,
            readCount: 0,
            saveCount: 0,
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 1,
            cheerCount: 0,
            created: Now(),
          },
        })
      ),
      Update(Var("authorRef"), {
        data: {
          stats: {
            commentCount: Add(
              Select(["data", "stats", "commentCount"], Var("author")),
              1
            ),
          },
        },
      }),
      Update(contentRef, {
        data: {
          stats: {
            commentCount: Add(
              Select(["data", "stats", "commentCount"], Var("content")),
              1
            ),
          },
        },
      }),
      Exists(Var("contentStatsRefMatch")),
    )
  );
}
