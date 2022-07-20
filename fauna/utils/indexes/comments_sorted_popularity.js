CreateIndex({
    name: "comments_sorted_popularity",
    source: {
        collection: [Collection("comments")],
        fields: {
            score: Query(
                Lambda(
                    "comment",
                    Let(
                        {
                            ageFactor: 1,
                            likeFactor: 2,
                            dislikeFactor: -3,
                            commentFactor: 4,

                            creationTime: Select(
                                ["data", "created"],
                                Var("comment")
                            ),
                            referenceTime: Time("2022-01-01T00:00:00+00:00"),

                            age: TimeDiff(
                                Var("referenceTime"),
                                Var("creationTime"),
                                "seconds"
                            ),
                            likeCount: Select(
                                ["data", "stats", "likeCount"],
                                Var("comment"),
                                0
                            ),
                            dislikeCount: Select(
                                ["data", "stats", "dislikeCount"],
                                Var("comment"),
                                0
                            ),
                            commentCount: Select(
                                ["data", "stats", "commentCount"],
                                Var("comment"),
                                0
                            ),
                        },
                        Add(
                            Multiply(Var("ageFactor"), Var("age")),
                            Multiply(Var("likeFactor"), Var("likeCount")),
                            Multiply(Var("dislikeFactor"), Var("dislikeCount")),
                            Multiply(Var("commentFactor"), Var("commentCount"))
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
