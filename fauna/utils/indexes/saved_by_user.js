CreateIndex({
    name: "publications_saved_by_author",
    source: {
        collection: [Collection("publicationauthor")],
    },
    terms: [
        {
            field: ["data", "author"],
        },
        {
            field: ["data", "saved"],
            value: true,
        },
    ],
    values: [
        {
            field: ["data", "savedAt"],
            reverse: true,
        },
        {
            field: ["data", "publication"],
        },
    ],
    serialized: true,
});
