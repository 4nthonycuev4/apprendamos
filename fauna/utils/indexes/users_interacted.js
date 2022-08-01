CreateIndex({
    name: "authors_interacted",
    source: {
        collection: [Collection("authorstats")],
        fields: {
            score: Query(
                Lambda(
                    "stats",
                    Let(
                        {
                            viewFactor: 1,
                            ageFactor: 2,
                            likeFactor: 3,
                            readFactor: 4,
                            saveFactor: 5,
                            dislikeFactor: -6,
                            commentFactor: 7,
                            cheerFactor: 8,
                            followingFactor: 9,
                        },
                        {}
                    )
                )
            ),
        },
    },
    terms: [
        {
            field: ["data", "author"],
        },
        {
            field: ["data", "save"],
            value: true,
        },
    ],
    values: [
        {
            field: ["data", "saved"],
            reverse: true,
        },
        {
            field: ["data", "publication"],
        },
    ],
    serialized: true,
});
