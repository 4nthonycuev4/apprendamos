/** @format */

import { query } from "faunadb";

import { GetUserRefByUsername, GetViewerRef } from "../user/read";

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
  Not,
  Now,
} = query;

export function LikeContent(contentRef, docType) {
  const likes = {};
  ["flashquiz", "post", "question", "answer"].map((x) => {
    if (x === docType) {
      likes[x] = 1;
    } else {
      likes[x] = 0;
    }
  });
  return Let(
    {
      viewerRef: GetViewerRef(),
      viewer: Get(Var("viewerRef")),

      viewerContentStatsRef: Match(
        Index(`stats_by_${docType}Ref_and_userRef`),
        contentRef,
        Var("viewerRef")
      ),

      content: Get(contentRef),

      authorRef: Select(["data", "authorRef"], Var("content")),
      author: Get(Var("authorRef")),

      viewerAuthorStatsRef: Match(
        Index("stats_by_authorRef_and_userRef"),
        Var("authorRef"),
        Var("viewerRef")
      ),

      newLikeStatus: If(
        Exists(Var("viewerContentStatsRef")),
        Not(Select(["data", "like"], Get(Var("viewerContentStatsRef")))),
        true
      ),
      popularityGain: If(Var("newLikeStatus"), 1, -1),
    },
    Do(
      If(
        Exists(Var("viewerAuthorStatsRef")),
        Update(Select(["ref"], Get(Var("viewerAuthorStatsRef"))), {
          data: {
            likes: {
              [docType]: Add(
                Select(
                  ["data", "likes", docType],
                  Get(Var("viewerAuthorStatsRef"))
                ),
                Var("popularityGain")
              ),
            },
          },
        }),
        Create(Collection("UserAuthorStats"), {
          data: {
            userRef: Var("viewerRef"),
            authorRef: Var("authorRef"),
            following: false,
            likes,
            saved: {
              flashquiz: 0,
              post: 0,
              question: 0,
              answer: 0,
            },
            comments: {
              flashquiz: 0,
              post: 0,
              question: 0,
              answer: 0,
            },
            created: Now(),
          },
        })
      ),
      Update(Var("authorRef"), {
        data: {
          stats: {
            received: {
              likes: Add(
                Select(["data", "stats", "received", "likes"], Var("author")),
                Var("popularityGain")
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
                Var("popularityGain")
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
                  likes: Add(
                    Select(["data", "stats", "likes"], Var("content")),
                    Var("popularityGain")
                  ),
                },
              },
            })
          ),
          viewerStats: If(
            Exists(Var("viewerContentStatsRef")),
            Update(Select(["ref"], Get(Var("viewerContentStatsRef"))), {
              data: {
                like: Var("newLikeStatus"),
              },
            }),
            Create(
              Collection(
                `User${docType.charAt(0).toUpperCase() + docType.slice(1)}Stats`
              ),
              {
                data: {
                  userRef: Var("viewerRef"),
                  [`${docType}Ref`]: contentRef,
                  like: Var("newLikeStatus"),
                  saved: false,
                  comments: 0,
                  created: Now(),
                },
              }
            )
          ),
        },
        {
          stats: Var("statsUpdated"),
          viewerStats: Var("viewerStats"),
        }
      )
    )
  );
}

export function FollowUser(username) {
  return Let(
    {
      viewerRef: GetViewerRef(),
      authorRef: GetUserRefByUsername(username),
      viewerAuthorStatsRefMatch: Match(
        Index("stats_by_authorRef_and_userRef"),
        Var("authorRef"),
        Var("viewerRef")
      ),
      viewerAuthorStats: If(
        Exists(Var("viewerAuthorStatsRefMatch")),
        Get(Var("viewerAuthorStatsRefMatch")),
        null
      ),

      viewerAuthorStatsUpdated: If(
        Not(Exists(Var("viewerAuthorStatsRefMatch"))),
        Create(Collection("UserAuthorStats"), {
          data: {
            userRef: Var("viewerRef"),
            authorRef: Var("authorRef"),
            following: true,
            likes: { flashquiz: 0, post: 0, question: 0, answer: 0 },
            saved: {
              flashquiz: 0,
              post: 0,
              question: 0,
              answer: 0,
            },
            comments: {
              flashquiz: 0,
              post: 0,
              question: 0,
              answer: 0,
            },
            created: Now(),
          },
        }),
        Update(Select(["ref"], Var("viewerAuthorStats")), {
          data: {
            following: Not(
              Select(["data", "following"], Var("viewerAuthorStats"))
            ),
          },
        })
      ),

      newFollowingStatus: Select(
        ["data", "following"],
        Var("viewerAuthorStatsUpdated")
      ),

      author: Update(Var("authorRef"), {
        data: {
          stats: {
            followers: Add(
              Select(["data", "stats", "followers"], Get(Var("authorRef"))),
              If(Var("newFollowingStatus"), 1, -1)
            ),
          },
        },
      }),
      viewer: Update(Var("viewerRef"), {
        data: {
          stats: {
            following: Add(
              Select(["data", "stats", "following"], Get(Var("authorRef"))),
              If(Var("newFollowingStatus"), 1, -1)
            ),
          },
        },
      }),
    },
    {
      stats: Select(["data", "stats"], Var("author")),
      viewerStats: Var("viewerAuthorStatsUpdated"),
    }
  );
}
