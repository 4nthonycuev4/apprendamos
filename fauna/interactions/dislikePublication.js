import { query } from "faunadb";

import { GetViewerRef } from "../users/read";

const { Let, Select, Index, Get, If, Var, Exists, Match, Add, Collection, Time, Update, Now, Create, SubString, Not, Do, Delete, And, Equals, } = query;

export const DislikePublication = (ref) => Let(
    {
        publication: Get(ref),
        author: Get(Select(["data", "author"], Var("publication"))),
        interactionsMatch: Match(Index("publication_interactions"), [ref, GetViewerRef()]),
    },
    If(
        Exists(Var("interactionsMatch")),
        Let(
            {
                interactions: Get(Var("interactionsMatch")),
                newDislikeStatus: Not(Select(["data", "dislike"], Var("interactions"), false)),
                newLikeStatus: If(And(Var("newDislikeStatus"), Select(["data", "like"], Var("interactions"), false)), false, null)
            },
            Do(
                Update(Select(["ref"], Var("interactions")), {
                    data: {
                        like: Var("newLikeStatus"),
                        dislike: Var("newDislikeStatus"),
                    }
                }),
                Update(ref, {
                    data: {
                        stats: {
                            dislikeCount: Add(Select(["data", "stats", "dislikeCount"], Var("publication"), 0), If(Var("newDislikeStatus"), 1, -1)),
                            likeCount: If(Equals(Var("newLikeStatus"), false), Add(Select(["data", "stats", "likeCount"], Var("publication"), 1), -1), Select(["data", "stats", "likeCount"], Var("publication"), null))
                        }
                    }
                }),
                Update(Select(["ref"], Var("author")), {
                    data: {
                        stats: {
                            dislikeCount: Add(Select(["data", "stats", "dislikeCount"], Var("author"), 0), If(Var("newDislikeStatus"), 1, -1)),
                            likeCount: If(Equals(Var("newLikeStatus"), false), Add(Select(["data", "stats", "likeCount"], Var("author"), 1), -1), Select(["data", "stats", "likeCount"], Var("author"), null))
                        }
                    }
                }),
                If(Equals(Var("newLikeStatus"), false),
                    Delete(Select(["ref"], Get(Match(Index("notification"), [ref, GetViewerRef(), "like"])))), null)
            )
        ),
        Do(
            Create(Collection("publicationinteractions"), {
                data: {
                    dislike: true,
                    publication: ref,
                    user: GetViewerRef(),
                    createdAt: Now(),
                }
            }),
            Update(ref, {
                data: {
                    stats: {
                        dislikeCount: Add(Select(["data", "stats", "dislikeCount"], Var("publication"), 0), 1),
                    }
                }
            }),
            Update(Select(["ref"], Var("author")), {
                data: {
                    stats: {
                        dislikeCount: Add(Select(["data", "stats", "dislikeCount"], Var("author"), 0), 1),
                    }
                }
            })
        )
    )
);
