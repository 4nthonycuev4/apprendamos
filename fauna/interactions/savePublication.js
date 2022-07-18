import { query } from "faunadb";

import { GetViewerRef } from "../users/read";

const { Let, Select, Index, Get, If, Var, Exists, Match, Add, Collection, Time, Update, Now, Create, SubString, Not, Do, Delete, And, Equals, } = query;

export const SavePublication = (ref) => Let(
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
                newSaveStatus: Not(Select(["data", "save"], Var("interactions"), false)),
            },
            Do(
                Update(Select(["ref"], Var("interactions")), {
                    data: {
                        save: Var("newSaveStatus"),
                    }
                }),
                Update(ref, {
                    data: {
                        stats: {
                            saveCount: Add(Select(["data", "stats", "saveCount"], Var("publication"), 0), If(Var("newSaveStatus"), 1, -1)),
                        }
                    }
                }),
                Update(Select(["ref"], Var("author")), {
                    data: {
                        stats: {
                            saveCount: Add(Select(["data", "stats", "saveCount"], Var("author"), 0), If(Var("newSaveStatus"), 1, -1)),
                        }
                    }
                }),
                If(Var("newSaveStatus"),
                    Create(Collection("notifications"), {
                        data: {
                            type: "save",
                            status: ref,
                            body: SubString(Select(["data", "body"], Var("publication")), 0, 100),
                            author: Select(["data", "author"], Var("publication")),
                            user: GetViewerRef(),
                        }
                    }),
                    Delete(Select(["ref"], Get(Match(Index("notification"), [ref, GetViewerRef(), "save"]))))
                )
            )
        ),
        Do(
            Create(Collection("publicationinteractions"), {
                data: {
                    save: true,
                    publication: ref,
                    user: GetViewerRef(),
                    createdAt: Now(),
                }
            }),
            Update(ref, {
                data: {
                    stats: {
                        saveCount: Add(Select(["data", "stats", "saveCount"], Var("publication"), 0), 1),
                    }
                }
            }),
            Update(Select(["ref"], Var("author")), {
                data: {
                    stats: {
                        saveCount: Add(Select(["data", "stats", "saveCount"], Var("author"), 0), 1),
                    }
                }
            }),
            Create(Collection("notifications"), {
                data: {
                    type: "save",
                    status: ref,
                    body: SubString(Select(["data", "body"], Var("publication")), 0, 100),
                    author: Select(["data", "author"], Var("publication")),
                    user: GetViewerRef(),
                }
            }
            )
        )
    )
);

