CreateIndex({
    name: "publications_sorted_by_creation_time",
    source: Collection("publications"),
    terms: [
        {
            field: ["ref"],
        },
    ],
    values: [
        {
            field: ["data", "created_at"],
            reverse: true,
        },
        {
            field: ["ref"],
        },
    ],
    serialized: true,
});
