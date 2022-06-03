/** @format */

import { query } from "faunadb";

import { GetViewerRef, GetViewer, GetUserByUsername } from "./read";

const { Update, Not, Get, Let, Select, Var, If, Match, Index, Add } = query;

export function UpdateViewer(data) {
  return Update(GetViewerRef(), {
    data,
  });
}

export function FollowUser(username) {
  return Let(
    {
      viewer: GetViewer(),
      viewerRef: Select("ref", Var("viewer")),

      author: GetUserByUsername(username),
      authorRef: Select("ref", Var("author")),

      authorStats: Get(Match(
        Index("authorstats_by_user"),
        [Var("authorRef"), Var("viewerRef")]
      )),

      following: Select(["data", "following"], Var("authorStats"), false),
      gain: If(
        Var("following"),
        -1,
        1
      ),

      authorStatsUpdated: Update(Select(["ref"], Var("authorStats")), {
        data: {
          following: Not(Var("following")),
        },
      }),

      authorUpdated: Update(Var("authorRef"), {
        data: {
          stats: {
            followerCount: Add(
              Select(["data", "stats", "followerCount"], Var("author"), 0),
              Var("gain")
            ),
          },
        },
      }),
      viewerUpdated: Update(Var("viewerRef"), {
        data: {
          stats: {
            followingCount: Add(
              Select(["data", "stats", "followingCount"], Var("viewer"), 0),
              Var("gain")
            ),
          },
        },
      }),

    },
    {
      stats: {
        followerCount: Select(["data", "stats", "followerCount"], Var("authorUpdated"), 0),
        followingCount: Select(["data", "stats", "followingCount"], Var("authorUpdated"), 0),
        likeCount: Select(["data", "stats", "likeCount"], Var("authorUpdated"), 0),
        following: Not(Var("following")),
      },
    }
  );
}
