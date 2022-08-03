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
    Call,
    Paginate,
    Function: Fn,
} = query;

const SavePublication = (ref) =>
    Let(
        {
            publication: Get(ref),
            author: Get(Select(["data", "author"], Var("publication"))),
            interactor: Call(Fn("getViewer")),
            interactions_match: Match(
                Index("single_publication_interactions"),
                [ref, Select(["ref"], Var("interactor"))]
            ),
        },
        If(
            Exists(Var("interactions_match")),
            Let(
                {
                    interactions: Get(Var("interactions_match")),
                    new_save_status: Not(
                        Select(["data", "save"], Var("interactions"), false)
                    ),
                },
                Do(
                    Update(Select(["ref"], Var("interactions")), {
                        data: {
                            save: Var("new_save_status"),
                            saved_at: Now(),
                        },
                    }),
                    Update(ref, {
                        data: {
                            stats: {
                                save_count: Add(
                                    Select(
                                        ["data", "stats", "save_count"],
                                        Var("publication"),
                                        0
                                    ),
                                    If(Var("new_save_status"), 1, -1)
                                ),
                            },
                        },
                    }),
                    Update(Select(["ref"], Var("author")), {
                        data: {
                            stats: {
                                save_count: Add(
                                    Select(
                                        ["data", "stats", "save_count"],
                                        Var("author"),
                                        0
                                    ),
                                    If(Var("new_save_status"), 1, -1)
                                ),
                            },
                        },
                    }),
                    If(
                        Var("new_save_status"),
                        Create(Collection("notifications"), {
                            data: {
                                alert: "save",
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
                                interactor: Select(["ref"], Var("interactor")),
                            },
                        }),
                        Delete(
                            Select(
                                ["data", 0],
                                Paginate(
                                    Match(
                                        Index(
                                            "single_status_interactions_notification"
                                        ),
                                        [
                                            ref,
                                            Select(["ref"], Var("interactor")),
                                            "save",
                                        ]
                                    )
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
                        saved_At: Now(),
                        publication: ref,
                        author: Select(["ref"], Var("interactor")),
                        created_at: Now(),
                    },
                }),
                Update(ref, {
                    data: {
                        stats: {
                            save_count: Add(
                                Select(
                                    ["data", "stats", "save_count"],
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
                            save_count: Add(
                                Select(
                                    ["data", "stats", "save_count"],
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
                        alert: "save",
                        status: ref,
                        body: SubString(
                            Select(["data", "body"], Var("publication")),
                            0,
                            100
                        ),
                        author: Select(["ref"], Var("author")),
                        interactor: Select(["ref"], Var("interactor")),
                    },
                })
            )
        )
    );

export default SavePublication;
