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
    And,
    Equals,
} = query;

import { GetViewer } from "../../users/read";

const LikePublication = (ref) =>
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
                    newLikeStatus: Not(
                        Select(["data", "like"], Var("interactions"), false)
                    ),
                    newDislikeStatus: If(
                        And(
                            Var("newLikeStatus"),
                            Select(
                                ["data", "dislike"],
                                Var("interactions"),
                                false
                            )
                        ),
                        false,
                        null
                    ),
                },
                Do(
                    Update(Select(["ref"], Var("interactions")), {
                        data: {
                            like: Var("newLikeStatus"),
                            dislike: Var("newDislikeStatus"),
                        },
                    }),
                    Update(ref, {
                        data: {
                            stats: {
                                likeCount: Add(
                                    Select(
                                        ["data", "stats", "likeCount"],
                                        Var("publication"),
                                        0
                                    ),
                                    If(Var("newLikeStatus"), 1, -1)
                                ),
                                dislikeCount: If(
                                    Equals(Var("newDislikeStatus"), false),
                                    Add(
                                        Select(
                                            ["data", "stats", "dislikeCount"],
                                            Var("publication"),
                                            1
                                        ),
                                        -1
                                    ),
                                    Select(
                                        ["data", "stats", "dislikeCount"],
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
                                likeCount: Add(
                                    Select(
                                        ["data", "stats", "likeCount"],
                                        Var("author"),
                                        0
                                    ),
                                    If(Var("newLikeStatus"), 1, -1)
                                ),
                                dislikeCount: If(
                                    Equals(Var("newDislikeStatus"), false),
                                    Add(
                                        Select(
                                            ["data", "stats", "dislikeCount"],
                                            Var("author"),
                                            1
                                        ),
                                        -1
                                    ),
                                    Select(
                                        ["data", "stats", "dislikeCount"],
                                        Var("author"),
                                        null
                                    )
                                ),
                            },
                        },
                    }),
                    If(
                        Var("newLikeStatus"),
                        Create(Collection("notifications"), {
                            data: {
                                type: "like",
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
                                        "like",
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
                        like: true,
                        publication: ref,
                        user: Select(["ref"], Var("viewer")),
                        createdAt: Now(),
                    },
                }),
                Update(ref, {
                    data: {
                        stats: {
                            likeCount: Add(
                                Select(
                                    ["data", "stats", "likeCount"],
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
                            likeCount: Add(
                                Select(
                                    ["data", "stats", "likeCount"],
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
                        type: "like",
                        status: ref,
                        body: SubString(
                            Select(["data", "body"], Var("publication")),
                            0,
                            100
                        ),
                        user: Select(["ref"], Var("viewer")),
                        author: Select(["data", "author"], Var("publication")),
                    },
                })
            )
        )
    );

export default LikePublication;
