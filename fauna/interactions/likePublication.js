import { query } from "faunadb";

import { GetPartialUser, GetUserByUsername, GetUserRefByUsername, GetViewer, GetViewerRef } from "../users/read";

const { Let, Select, Index, Get, If, Var, Exists, Match, Paginate, Map, Multiply, TimeDiff, Add, Join, Collection, Time, Lambda, Update, Now, Create, SubString, Take, Count, Documents, Not, Do, Delete } = query;

/* 
1. Verify that the interactions exists
2. If it does, get the interactions
3. If it doesn't, create the interactions
*/

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
            },
            Do(
                Update(Select(["ref"], Var("interactions")), {
                    data: {
                        like: Var("newLikeStatus"),
                    }
                }),
                Update(ref, {
                    data: {
                        stats: {
                            likeCount: Add(Select(["data", "stats", "likeCount"], Var("publication"), 0), If(Var("newLikeStatus"), 1, -1)),
                        }
                    }
                }),
                Update(Select(["ref"], Var("author")), {
                    data: {
                        stats: {
                            likeCount: Add(Select(["data", "stats", "likeCount"], Var("author"), 0), If(Var("newLikeStatus"), 1, -1)),
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
