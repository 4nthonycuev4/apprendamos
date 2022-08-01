/** @format */

import { query } from "faunadb";

import { GetViewerRef, GetViewer, GetAuthorBynickname } from "./read";

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

export function FollowAuthor(nickname) {
    return Let(
        {
            viewer: GetViewer(),
            viewerRef: Select("ref", Var("viewer")),

            author: GetAuthorBynickname(nickname),
            authorRef: Select("ref", Var("author")),

            authorAuthorRelMatch: Match(Index("author_author_rel"), [
                Var("authorRef"),
                Var("viewerRef"),
            ]),
            authorAuthorRel: If(
                Exists(Var("authorAuthorRelMatch")),
                Get(Var("authorAuthorRelMatch")),
                Create("authorauthor", {
                    data: {
                        author: Var("authorRef"),
                        author: Var("viewerRef"),
                        createdAt: Now(),
                    },
                })
            ),

            following: Select(
                ["data", "following"],
                Var("authorAuthorRel"),
                false
            ),
            gain: If(Var("following"), -1, 1),

            authorStatsUpdated: Update(
                Select(["ref"], Var("authorAuthorRel")),
                {
                    data: {
                        following: Not(Var("following")),
                    },
                }
            ),

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
