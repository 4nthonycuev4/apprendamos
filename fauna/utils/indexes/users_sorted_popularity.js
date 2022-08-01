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
                            ageFactor: 1,
                            partialViewFactor: 2,
                            fullViewFactor: 3,
                            stalkFactor: 4,
                            likeFactor: 5,
                            dislikeFactor: -6,
                            commentFactor: 7,
                            saveFactor: 8,
                            followerFactor: 9,
                            publicationFactor: 10,
                            answerFactor: 11,

                            joinTime: Select(
                                ["data", "joinedAt"],
                                Var("author")
                            ),
                            referenceTime: Time("2022-01-01T00:00:00+00:00"),

                            age: TimeDiff(
                                Var("referenceTime"),
                                Var("joinTime"),
                                "seconds"
                            ),
                            partialViewCount: Select(
                                ["data", "stats", "partialViewCount"],
                                Var("author"),
                                0
                            ),
                            fullViewCount: Select(
                                ["data", "stats", "fullViewCount"],
                                Var("author"),
                                0
                            ),
                            stalkCount: Select(
                                ["data", "stats", "stalkCount"],
                                Var("author"),
                                0
                            ),
                            likeCount: Select(
                                ["data", "stats", "likeCount"],
                                Var("author"),
                                0
                            ),
                            commentCount: Select(
                                ["data", "stats", "commentCount"],
                                Var("author"),
                                0
                            ),
                            dislikeCount: Select(
                                ["data", "stats", "dislikeCount"],
                                Var("author"),
                                0
                            ),
                            saveCount: Select(
                                ["data", "stats", "saveCount"],
                                Var("author"),
                                0
                            ),
                            followerCount: Select(
                                ["data", "stats", "followerCount"],
                                Var("author"),
                                0
                            ),
                            publicationCount: Select(
                                ["data", "stats", "publicationCount"],
                                Var("author"),
                                0
                            ),
                            answerCount: Select(
                                ["data", "stats", "answerCount"],
                                Var("author"),
                                0
                            ),
                        },
                        Add(
                            Multiply(Var("ageFactor"), Var("age")),
                            Multiply(
                                Var("partialViewFactor"),
                                Var("partialViewCount")
                            ),
                            Multiply(
                                Var("fullViewFactor"),
                                Var("fullViewCount")
                            ),
                            Multiply(Var("stalkFactor"), Var("stalkCount")),
                            Multiply(Var("likeFactor"), Var("likeCount")),
                            Multiply(Var("dislikeFactor"), Var("dislikeCount")),
                            Multiply(Var("commentFactor"), Var("commentCount")),
                            Multiply(Var("saveFactor"), Var("saveCount")),
                            Multiply(
                                Var("followerFactor"),
                                Var("followerCount")
                            ),
                            Multiply(
                                Var("publicationFactor"),
                                Var("publicationCount")
                            ),
                            Multiply(Var("answerFactor"), Var("answerCount"))
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
