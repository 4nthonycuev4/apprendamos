/** @format */

import { query } from "faunadb";

import { GetViewerRef, GetViewer, GetUserByUsername } from "./read";

const {
    Update,
    Not,
    Get,
    Let,
    Select,
    Var,
    If,
    Match,
    Index,
    Add,
    Exists,
    Create,
    Now,
} = query;

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

            authorUserRelMatch: Match(Index("author_user_rel"), [
                Var("authorRef"),
                Var("viewerRef"),
            ]),
            authorUserRel: If(
                Exists(Var("authorUserRelMatch")),
                Get(Var("authorUserRelMatch")),
                Create("authoruser", {
                    data: {
                        author: Var("authorRef"),
                        user: Var("viewerRef"),
                        createdAt: Now(),
                    },
                })
            ),

            following: Select(
                ["data", "following"],
                Var("authorUserRel"),
                false
            ),
            gain: If(Var("following"), -1, 1),

            authorStatsUpdated: Update(Select(["ref"], Var("authorUserRel")), {
                data: {
                    following: Not(Var("following")),
                },
            }),

            authorUpdated: Update(Var("authorRef"), {
                data: {
                    stats: {
                        followerCount: Add(
                            Select(
                                ["data", "stats", "followerCount"],
                                Var("author"),
                                0
                            ),
                            Var("gain")
                        ),
                    },
                },
            }),
            viewerUpdated: Update(Var("viewerRef"), {
                data: {
                    stats: {
                        followingCount: Add(
                            Select(
                                ["data", "stats", "followingCount"],
                                Var("viewer"),
                                0
                            ),
                            Var("gain")
                        ),
                    },
                },
            }),
        },
        {
            following: Not(Var("following")),
        }
    );
}
