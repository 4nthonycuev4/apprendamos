CreateIndex({
    name: "publications_by_week",
    source: {
        collection: Collection("publications"),
        fields: {
            week: Query(
                Lambda(
                    "publication",
                    Divide(
                        Add(
                            ToSeconds(
                                Select(
                                    ["data", "created_at"],
                                    Var("publication")
                                )
                            ),
                            -3 * 24 * 60 * 60
                        ),
                        7 * 24 * 60 * 60
                    )
                )
            ),
        },
    },
    terms: [
        {
            binding: "week",
        },
    ],
    values: [
        {
            field: ["ref"],
            reverse: true,
        },
    ],
    serialized: true,
});
