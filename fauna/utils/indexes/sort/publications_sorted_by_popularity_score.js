CreateIndex({
    name: "publications_sorted_by_popularity_score",
    source: {
        collection: Collection("publications"),
        fields: {
            popularity_score: Query(
                Lambda(
                    "publication",
                    Let(
                        {
                            age_factor: 1,
                            like_factor: 1,
                            save_factor: 2,
                            dislike_factor: -1.5,
                            comment_factor: 2.5,
                            cheer_factor: 5,

                            creation_time: Select(
                                ["data", "created_at"],
                                Var("publication")
                            ),
                            reference_time: Time("2022-01-01T00:00:00+00:00"),

                            age: TimeDiff(
                                Var("reference_time"),
                                Var("creation_time"),
                                "seconds"
                            ),
                            like_count: Select(
                                ["data", "stats", "like_count"],
                                Var("publication"),
                                0
                            ),
                            save_count: Select(
                                ["data", "stats", "save_count"],
                                Var("publication"),
                                0
                            ),
                            dislike_count: Select(
                                ["data", "stats", "dislike_count"],
                                Var("publication"),
                                0
                            ),
                            comment_count: Select(
                                ["data", "stats", "comment_count"],
                                Var("publication"),
                                0
                            ),
                            cheer_count: Select(
                                ["data", "stats", "cheer_count"],
                                Var("publication"),
                                0
                            ),
                        },
                        Add(
                            Multiply(Var("age_factor"), Var("age")),
                            Multiply(Var("like_factor"), Var("like_count")),
                            Multiply(Var("save_factor"), Var("save_count")),
                            Multiply(
                                Var("dislike_factor"),
                                Var("dislike_count")
                            ),
                            Multiply(
                                Var("comment_factor"),
                                Var("comment_count")
                            ),
                            Multiply(Var("cheer_factor"), Var("cheer_count"))
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
            binding: "popularity_score",
            reverse: true,
        },
        {
            field: ["ref"],
        },
    ],
    serialized: true,
});
