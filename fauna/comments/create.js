/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "../authors/read";

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

export function CreatePublicationComment(publicationRef, body) {
    return Let(
        {
            viewerRef: GetViewerRef(),
            viewer: Get(Var("viewerRef")),

            publicationStatsRefMatch: Match(
                Index("publicationstats_by_author"),
                publicationRef,
                Var("viewerRef")
            ),

            publication: Get(publicationRef),

            authorRef: Select(["data", "author"], Var("publication")),
            author: Get(Var("authorRef")),

            authorStatsMatch: Match(
                Index("authorstats_by_author"),
                Var("authorRef"),
                Var("viewerRef")
            ),

            authorStats: If(
                Exists(Var("authorStatsMatch")),
                Get(Var("authorStatsMatch")),
                false
            ),

            comment: Create(Collection("comments"), {
                data: {
                    body,
                    author: Var("viewerRef"),
                    parent: publicationRef,
                    createdAt: Now(),
                },
            }),
        },
        Do(
            If(
                Exists(Var("authorStatsMatch")),
                Update(Select(["ref"], Var("authorStats")), {
                    data: {
                        stats: {
                            commentCount: Add(
                                Select(
                                    ["data", "commentCount"],
                                    Var("authorStats")
                                ),
                                1
                            ),
                        },
                    },
                }),
                Create(Collection("authorstats"), {
                    data: {
                        author: Var("viewerRef"),
                        author: Var("authorRef"),
                        commentCount: 1,
                        createdAt: Now(),
                    },
                })
            ),
            Update(Var("authorRef"), {
                data: {
                    stats: {
                        commentCount: Add(
                            Select(
                                ["data", "stats", "commentCount"],
                                Var("author")
                            ),
                            1
                        ),
                    },
                },
            }),
            Update(publicationRef, {
                data: {
                    stats: {
                        commentCount: Add(
                            Select(
                                ["data", "stats", "commentCount"],
                                Var("publication")
                            ),
                            1
                        ),
                    },
                },
            }),
            Exists(Var("publicationStatsRefMatch"))
        )
    );
}
