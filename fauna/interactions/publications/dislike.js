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
} = query;

import { GetViewer } from "../../users/read";

const DislikePublication = (ref) =>
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
                    newDislikeStatus: Not(
                        Select(["data", "dislike"], Var("interactions"), false)
                    ),
                    newLikeStatus: If(
                        And(
                            Var("newDislikeStatus"),
                            Select(["data", "like"], Var("interactions"), false)
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
                                dislikeCount: Add(
                                    Select(
                                        ["data", "stats", "dislikeCount"],
                                        Var("publication"),
                                        0
                                    ),
                                    If(Var("newDislikeStatus"), 1, -1)
                                ),
                                likeCount: If(
                                    Equals(Var("newLikeStatus"), false),
                                    Add(
                                        Select(
                                            ["data", "stats", "likeCount"],
                                            Var("publication"),
                                            1
                                        ),
                                        -1
                                    ),
                                    Select(
                                        ["data", "stats", "likeCount"],
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
                                dislikeCount: Add(
                                    Select(
                                        ["data", "stats", "dislikeCount"],
                                        Var("author"),
                                        0
                                    ),
                                    If(Var("newDislikeStatus"), 1, -1)
                                ),
                                likeCount: If(
                                    Equals(Var("newLikeStatus"), false),
                                    Add(
                                        Select(
                                            ["data", "stats", "likeCount"],
                                            Var("author"),
                                            1
                                        ),
                                        -1
                                    ),
                                    Select(
                                        ["data", "stats", "likeCount"],
                                        Var("author"),
                                        null
                                    )
                                ),
                            },
                        },
                    }),
                    If(
                        Equals(Var("newLikeStatus"), false),
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
                        user: Select(["ref"], Var("viewer")),
                        createdAt: Now(),
                    },
                }),
                Update(ref, {
                    data: {
                        stats: {
                            dislikeCount: Add(
                                Select(
                                    ["data", "stats", "dislikeCount"],
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
                            dislikeCount: Add(
                                Select(
                                    ["data", "stats", "dislikeCount"],
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
