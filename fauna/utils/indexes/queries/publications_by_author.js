CreateIndex({
    name: "publications_by_author",
    source: Collection("publications"),
    terms: [
        {
            field: ["data", "author"],
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
