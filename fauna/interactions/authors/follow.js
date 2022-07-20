import { query } from "faunadb";
const {
    Update,
    Not,
    Get,
    Let,
    Select,
    Var,
    If,
    Match,
    Index,
    Add,
    Exists,
    Create,
    Do,
    Now,
    Delete,
    Collection,
} = query;

import { GetViewer, GetUserByUsername } from "../../users/read";

const FollowAuthor = (username) =>
    Let(
        {
            author: GetUserByUsername(username),
            viewer: GetViewer(),
            interactionsMatch: Match(Index("author_interactions"), [
                Select(["ref"], Var("author")),
                Select(["ref"], Var("viewer")),
            ]),
        },
        If(
            Exists(Var("interactionsMatch")),
            Let(
                {
                    interactions: Get(Var("interactionsMatch")),
                    newFollowStatus: Not(
                        Select(["data", "follow"], Var("interactions"), false)
                    ),
                },
                Do(
                    Update(Select(["ref"], Var("interactions")), {
                        data: {
                            follow: Var("newFollowStatus"),
                        },
                    }),
                    Update(Select(["ref"], Var("author")), {
                        data: {
                            stats: {
                                followerCount: Add(
                                    Select(
                                        ["data", "stats", "followerCount"],
                                        Var("author"),
                                        0
                                    ),
                                    If(Var("newFollowStatus"), 1, -1)
                                ),
                            },
                        },
                    }),
                    Update(Select(["ref"], Var("viewer")), {
                        data: {
                            stats: {
                                followingCount: Add(
                                    Select(
                                        ["data", "stats", "followingCount"],
                                        Var("viewer"),
                                        0
                                    ),
                                    If(Var("newFollowStatus"), 1, -1)
                                ),
                            },
                        },
                    }),
                    If(
                        Var("newFollowStatus"),
                        Create(Collection("notifications"), {
                            data: {
                                type: "follow",
                                author: Select(["ref"], Var("author")),
                                user: Select(["ref"], Var("viewer")),
                            },
                        }),
                        Delete(
                            Select(
                                ["ref"],
                                Get(
                                    Match(Index("follow_notification"), [
                                        Select(["ref"], Var("author")),
                                        Select(["ref"], Var("viewer")),
                                        "follow",
                                    ])
                                )
                            )
                        )
                    )
                )
            ),
            Do(
                Create(Collection("authorinteractions"), {
                    data: {
                        follow: true,
                        author: Select(["ref"], Var("author")),
                        user: Select(["ref"], Var("viewer")),
                        createdAt: Now(),
                    },
                }),
                Update(Select(["ref"], Var("author")), {
                    data: {
                        stats: {
                            followerCount: Add(
                                Select(
                                    ["data", "stats", "followerCount"],
                                    Var("author"),
                                    0
                                ),
                                1
                            ),
                        },
                    },
                }),
                Update(Select(["ref"], Var("viewer")), {
                    data: {
                        stats: {
                            followingCount: Add(
                                Select(
                                    ["data", "stats", "followingCount"],
                                    Var("viewer"),
                                    0
                                ),
                                1
                            ),
                        },
                    },
                }),
                Create(Collection("notifications"), {
                    data: {
                        type: "follow",
                        author: Select(["ref"], Var("author")),
                        user: Select(["ref"], Var("viewer")),
                    },
                })
            )
        )
    );

export default FollowAuthor;
