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
    Not,
    Do,
    Delete,
    And,
    Equals,
    Call,
    Function: Fn,
} = query;

const DislikePublication = (ref) =>
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
                    new_dislike_status: Not(
                        Select(["data", "dislike"], Var("interactions"), false)
                    ),
                    new_like_status: If(
                        And(
                            Var("new_dislike_status"),
                            Select(["data", "like"], Var("interactions"), false)
                        ),
                        false,
                        null
                    ),
                },
                Do(
                    Update(Select(["ref"], Var("interactions")), {
                        data: {
                            like: Var("new_like_status"),
                            dislike: Var("new_dislike_status"),
                        },
                    }),
                    Update(ref, {
                        data: {
                            stats: {
                                dislike_count: Add(
                                    Select(
                                        ["data", "stats", "dislike_count"],
                                        Var("publication"),
                                        0
                                    ),
                                    If(Var("new_dislike_status"), 1, -1)
                                ),
                                like_count: If(
                                    Equals(Var("new_like_status"), false),
                                    Add(
                                        Select(
                                            ["data", "stats", "like_count"],
                                            Var("publication"),
                                            1
                                        ),
                                        -1
                                    ),
                                    Select(
                                        ["data", "stats", " like_count"],
                                        Var("publication"),
                                        null
                                    )
                                ),
                            },
                        },
                    }),
                    Update(Select(["ref"], Var("author")), {
                        data: {
                            stats: {
                                dislike_count: Add(
                                    Select(
                                        ["data", "stats", "dislike_count"],
                                        Var("author"),
                                        0
                                    ),
                                    If(Var("new_dislike_status"), 1, -1)
                                ),
                                like_count: If(
                                    Equals(Var("new_like_status"), false),
                                    Add(
                                        Select(
                                            ["data", "stats", "like_count"],
                                            Var("author"),
                                            1
                                        ),
                                        -1
                                    ),
                                    Select(
                                        ["data", "stats", "like_count"],
                                        Var("author"),
                                        null
                                    )
                                ),
                            },
                        },
                    }),
                    If(
                        Equals(Var("new_like_status"), false),
                        Delete(
                            Select(
                                ["ref"],
                                Get(
                                    Match(
                                        Index(
                                            "single_status_interactions_notification"
                                        ),
                                        [
                                            ref,
                                            Select(["ref"], Var("interactor")),
                                            "like",
                                        ]
                                    )
                                )
                            )
                        ),
                        {}
                    )
                )
            ),
            Do(
                Create(Collection("publicationinteractions"), {
                    data: {
                        dislike: true,
                        publication: ref,
                        interactor: Select(["ref"], Var("interactor")),
                        created_at: Now(),
                    },
                }),
                Update(ref, {
                    data: {
                        stats: {
                            dislike_count: Add(
                                Select(
                                    ["data", "stats", "dislike_count"],
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
                            dislike_count: Add(
                                Select(
                                    ["data", "stats", "dislike_count"],
                                    Var("author"),
                                    0
                                ),
                                1
                            ),
                        },
                    },
                })
            )
        )
    );

export default DislikePublication;
