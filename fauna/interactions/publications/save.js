import { query } from "faunadb";
const {
    Let,
    Select,
    Index,
    Get,
    If,
    Var,
    Exists,
    Match,
    Add,
    Collection,
    Update,
    Now,
    Create,
    SubString,
    Not,
    Do,
    Delete,
} = query;

import { GetViewer } from "../../users/read";

const SavePublication = (ref) =>
    Let(
        {
            publication: Get(ref),
            author: Get(Select(["data", "author"], Var("publication"))),
            viewer: GetViewer(),
            interactionsMatch: Match(Index("publication_interactions"), [
                ref,
                Select(["ref"], Var("viewer")),
            ]),
        },
        If(
            Exists(Var("interactionsMatch")),
            Let(
                {
                    interactions: Get(Var("interactionsMatch")),
                    newSaveStatus: Not(
                        Select(["data", "save"], Var("interactions"), false)
                    ),
                },
                Do(
                    Update(Select(["ref"], Var("interactions")), {
                        data: {
                            save: Var("newSaveStatus"),
                            savedAt: Now(),
                        },
                    }),
                    Update(ref, {
                        data: {
                            stats: {
                                saveCount: Add(
                                    Select(
                                        ["data", "stats", "saveCount"],
                                        Var("publication"),
                                        0
                                    ),
                                    If(Var("newSaveStatus"), 1, -1)
                                ),
                            },
                        },
                    }),
                    Update(Select(["ref"], Var("author")), {
                        data: {
                            stats: {
                                saveCount: Add(
                                    Select(
                                        ["data", "stats", "saveCount"],
                                        Var("author"),
                                        0
                                    ),
                                    If(Var("newSaveStatus"), 1, -1)
                                ),
                            },
                        },
                    }),
                    If(
                        Var("newSaveStatus"),
                        Create(Collection("notifications"), {
                            data: {
                                type: "save",
                                status: ref,
                                body: SubString(
                                    Select(
                                        ["data", "body"],
                                        Var("publication")
                                    ),
                                    0,
                                    100
                                ),
                                author: Select(
                                    ["data", "author"],
                                    Var("publication")
                                ),
                                user: Select(["ref"], Var("viewer")),
                            },
                        }),
                        Delete(
                            Select(
                                ["ref"],
                                Get(
                                    Match(Index("status_notification"), [
                                        Select(["ref"], Var("author")),
                                        Select(["ref"], Var("viewer")),
                                        "save",
                                        ref,
                                    ])
                                )
                            )
                        )
                    )
                )
            ),
            Do(
                Create(Collection("publicationinteractions"), {
                    data: {
                        save: true,
                        savedAt: Now(),
                        publication: ref,
                        user: Select(["ref"], Var("viewer")),
                        createdAt: Now(),
                    },
                }),
                Update(ref, {
                    data: {
                        stats: {
                            saveCount: Add(
                                Select(
                                    ["data", "stats", "saveCount"],
                                    Var("publication"),
                                    0
                                ),
                                1
                            ),
                        },
                    },
                }),
                Update(Select(["ref"], Var("author")), {
                    data: {
                        stats: {
                            saveCount: Add(
                                Select(
                                    ["data", "stats", "saveCount"],
                                    Var("author"),
                                    0
                                ),
                                1
                            ),
                        },
                    },
                }),
                Create(Collection("notifications"), {
                    data: {
                        type: "save",
                        status: ref,
                        body: SubString(
                            Select(["data", "body"], Var("publication")),
                            0,
                            100
                        ),
                        author: Select(["data", "author"], Var("publication")),
                        user: Select(["ref"], Var("viewer")),
                    },
                })
            )
        )
    );

export default SavePublication;
