import { query } from "faunadb";

import { GetViewerRef } from "../users/read";

const { Let, Select, Index, Get, If, Var, Exists, Match, Add, Collection, Time, Update, Now, Create, SubString, Not, Do, Delete, And, Equals, } = query;

export const LikePublication = (ref) => Let(
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
                newLikeStatus: Not(Select(["data", "like"], Var("interactions"), false)),
                newDislikeStatus: If(And(Var("newLikeStatus"), Select(["data", "dislike"], Var("interactions"), false)), false, null)
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
                            likeCount: Add(Select(["data", "stats", "likeCount"], Var("publication"), 0), If(Var("newLikeStatus"), 1, -1)),
                            dislikeCount: If(Equals(Var("newDislikeStatus"), false), Add(Select(["data", "stats", "dislikeCount"], Var("publication"), 1), -1), Select(["data", "stats", "dislikeCount"], Var("publication"), null))
                        }
                    }
                }),
                Update(Select(["ref"], Var("author")), {
                    data: {
                        stats: {
                            likeCount: Add(Select(["data", "stats", "likeCount"], Var("author"), 0), If(Var("newLikeStatus"), 1, -1)),
                            dislikeCount: If(Equals(Var("newDislikeStatus"), false), Add(Select(["data", "stats", "dislikeCount"], Var("author"), 1), -1), Select(["data", "stats", "dislikeCount"], Var("author"), null))
                        }
                    }
                }),
                If(Var("newLikeStatus"),
                    Create(Collection("notifications"), {
                        data: {
                            type: "like",
                            status: ref,
                            body: SubString(Select(["data", "body"], Var("publication")), 0, 100),
                            author: Var("author"),
                            user: GetViewerRef(),
                        }
                    }),
                    Delete(Select(["ref"], Get(Match(Index("notification"), [ref, GetViewerRef(), "like"]))))
                )
            )
        ),
        Do(
            Create(Collection("publicationinteractions"), {
                data: {
                    like: true,
                    publication: ref,
                    user: GetViewerRef(),
                    createdAt: Now(),
                }
            }),
            Update(ref, {
                data: {
                    stats: {
                        likeCount: Add(Select(["data", "stats", "likeCount"], Var("publication"), 0), 1),
                    }
                }
            }),
            Update(Select(["ref"], Var("author")), {
                data: {
                    stats: {
                        likeCount: Add(Select(["data", "stats", "likeCount"], Var("author"), 0), 1),
                    }
                }
            }),
            Create(Collection("notifications"), {
                data: {
                    type: "like",
                    status: ref,
                    body: SubString(Select(["data", "body"], Var("publication")), 0, 100),
                    user: GetViewerRef(),
                    author: Var("author"),
                }
            })
        )
    )
)
