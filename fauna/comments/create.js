/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "../user/read";

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
  Paginate,
} = query;

export function CreateComment(ref, collection, message, coins) {
  return Let(
    {
      viewerRef: GetViewerRef(),
      viewer: Get(Var("viewerRef")),

      contentStatsRefMatch: Match(
        Index(`stats_by_${docType}Ref_and_userRef`),
        contentRef,
        Var("viewerRef")
      ),

      content: Get(contentRef),

      authorRef: Select(["data", "authorRef"], Var("content")),
      author: Get(Var("authorRef")),

      viewerAuthorStatsRefMatch: Match(
        Index("stats_by_authorRef_and_userRef"),
        Var("authorRef"),
        Var("viewerRef")
      ),

      comment: Create(
        Collection(
          `Comments${docType.charAt(0).toUpperCase() + docType.slice(1)}`
        ),
        {
          data: {
            message,
            coins,
            authorRef: Var("viewerRef"),
            [`${docType}Ref`]: contentRef,
            created: Now(),
          },
        }
      ),
    },
    Do(
      If(
        Exists(Var("viewerAuthorStatsRefMatch")),
        Update(
          Select(["data", 0], Paginate(Var("viewerAuthorStatsRefMatch"))),
          {
            data: {
              comments: {
                [docType]: Add(
                  Select(
                    ["data", "comments", docType],
                    Get(Var("viewerAuthorStatsRefMatch"))
                  ),
                  1
                ),
              },
            },
          }
        ),
        Create(Collection("UserAuthorStats"), {
          data: {
            userRef: Var("viewerRef"),
            authorRef: Var("authorRef"),
            following: false,
            likes: {
              memorama: 0,
              article: 0,
              question: 0,
              answer: 0,
            },
            saved: {
              memorama: 0,
              article: 0,
              question: 0,
              answer: 0,
            },
            comments,
            created: Now(),
          },
        })
      ),
      Update(Var("authorRef"), {
        data: {
          stats: {
            received: {
              comments: Add(
                Select(
                  ["data", "stats", "received", "comments"],
                  Var("author")
                ),
                1
              ),
            },
          },
        },
      }),
      Update(Var("viewerRef"), {
        data: {
          stats: {
            given: {
              likes: Add(
                Select(["data", "stats", "given", "likes"], Var("viewer")),
                1
              ),
            },
          },
        },
      }),
      Let(
        {
          statsUpdated: Select(
            ["data", "stats"],
            Update(contentRef, {
              data: {
                stats: {
                  comments: Add(
                    Select(["data", "stats", "comments"], Var("content")),
                    1
                  ),
                },
              },
            })
          ),
          viewerStats: If(
            Exists(Var("viewerContentStatsRefMatch")),
            Update(
              Select(["data", 0], Paginate(Var("viewerContentStatsRefMatch"))),
              {
                data: {
                  comments: Add(
                    Select(
                      ["data", "comments"],
                      Get(Var("viewerContentStatsRefMatch"))
                    ),
                    1
                  ),
                },
              }
            ),
            Create(
              Collection(
                `User${docType.charAt(0).toUpperCase() + docType.slice(1)}Stats`
              ),
              {
                data: {
                  userRef: Var("viewerRef"),
                  [`${docType}Ref`]: contentRef,
                  like: false,
                  saved: false,
                  comments: 1,
                  created: Now(),
                },
              }
            )
          ),
        },
        {
          stats: Var("statsUpdated"),
          viewerStats: Var("viewerStats"),
          comment: Var("comment"),
          author: Var("viewer"),
        }
      )
    )
  );
}
