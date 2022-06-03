CreateIndex({
    name: "users_sorted_popularity",
    source: {
        collection: [Collection("users")],
        fields: {
            score: Query(
                Lambda(
                    "user",
                    Let(
                        {
                            ageFactor: 1,
                            viewFactor: 2,
                            readFactor: 3,
                            likeFactor: 4,
                            dislikeFactor: -5,
                            commentFactor: 6,
                            saveFactor: 7,
                            followerFactor: 8,

                            joinTime: Select(["data", "joined"], Var("user")),
                            referenceTime: Time("2022-01-01T00:00:00+00:00"),

                            age: TimeDiff(Var("referenceTime"), Var("joinTime"), "hours"),
                            viewCount: Select(["data", "stats", "viewCount"], Var("user")),
                            readCount: Select(["data", "stats", "readCount"], Var("user")),
                            likeCount: Select(["data", "stats", "likeCount"], Var("user")),
                            dislikeCount: Select(["data", "stats", "dislikeCount"], Var("user")),
                            commentCount: Select(["data", "stats", "commentCount"], Var("user")),
                            saveCount: Select(["data", "stats", "saveCount"], Var("user")),
                            followerCount: Select(["data", "stats", "followerCount"], Var("user")),
                        },
                        Add(
                            Multiply(Var("ageFactor"), Var("age")),
                            Multiply(Var("viewFactor"), Var("viewCount")),
                            Multiply(Var("readFactor"), Var("readCount")),
                            Multiply(Var("likeFactor"), Var("likeCount")),
                            Multiply(Var("dislikeFactor"), Var("dislikeCount")),
                            Multiply(Var("commentFactor"), Var("commentCount")),
                            Multiply(Var("saveFactor"), Var("saveCount")),
                            Multiply(Var("followerFactor"), Var("followerCount"))
                        )
                    )
                )
            )
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
        }
    ],
    serialized: true,
});