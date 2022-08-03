CreateIndex({
    name: "authors_sorted_popularity",
    source: {
        collection: Collection("authors"),
        fields: {
            score: Query(
                Lambda(
                    "author",
                    Let(
                        {
                            age_factor: 1,
                            partial_view_factor: 2,
                            full_view_factor: 3,
                            stalk_factor: 4,
                            like_factor: 5,
                            dislike_factor: -6,
                            comment_factor: 7,
                            save_factor: 8,
                            follower_factor: 9,
                            publication_factor: 10,
                            answer_factor: 11,

                            join_time: Select(
                                ["data", "joined_at"],
                                Var("author")
                            ),
                            reference_time: Time("2022-01-01T00:00:00+00:00"),

                            age: TimeDiff(
                                Var("reference_time"),
                                Var("join_time"),
                                "seconds"
                            ),
                            partial_view_count: Select(
                                ["data", "stats", "partial_view_count"],
                                Var("author"),
                                0
                            ),
                            full_view_count: Select(
                                ["data", "stats", "full_view_count"],
                                Var("author"),
                                0
                            ),
                            stalk_count: Select(
                                ["data", "stats", "stalk_count"],
                                Var("author"),
                                0
                            ),
                            like_count: Select(
                                ["data", "stats", "like_count"],
                                Var("author"),
                                0
                            ),
                            comment_count: Select(
                                ["data", "stats", "comment_count"],
                                Var("author"),
                                0
                            ),
                            dislike_count: Select(
                                ["data", "stats", "dislike_count"],
                                Var("author"),
                                0
                            ),
                            save_count: Select(
                                ["data", "stats", "save_count"],
                                Var("author"),
                                0
                            ),
                            follower_count: Select(
                                ["data", "stats", "follower_count"],
                                Var("author"),
                                0
                            ),
                            publication_count: Select(
                                ["data", "stats", "publication_count"],
                                Var("author"),
                                0
                            ),
                            answer_count: Select(
                                ["data", "stats", "answer_count"],
                                Var("author"),
                                0
                            ),
                        },
                        Add(
                            Multiply(Var("age_factor"), Var("age")),
                            Multiply(
                                Var("partial_view_factor"),
                                Var("partial_view_count")
                            ),
                            Multiply(
                                Var("full_view_factor"),
                                Var("full_view_count")
                            ),
                            Multiply(Var("stalk_factor"), Var("stalk_count")),
                            Multiply(Var("like_factor"), Var("like_count")),
                            Multiply(
                                Var("dislike_factor"),
                                Var("dislike_count")
                            ),
                            Multiply(
                                Var("comment_factor"),
                                Var("comment_count")
                            ),
                            Multiply(Var("save_factor"), Var("save_count")),
                            Multiply(
                                Var("follower_factor"),
                                Var("follower_count")
                            ),
                            Multiply(
                                Var("publication_factor"),
                                Var("publication_count")
                            ),
                            Multiply(Var("answer_factor"), Var("answer_count"))
                        )
                    )
                )
            ),
        },
    },
    terms: [
        {
            field: ["ref"],
        },
    ],
    values: [
        {
            binding: "score",
            reverse: true,
        },
        {
            field: ["ref"],
        },
    ],
    serialized: true,
});
