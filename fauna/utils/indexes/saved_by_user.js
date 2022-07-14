CreateIndex({
    name: "publications_saved_by_user",
    source: {
        collection: [Collection("publicationuser")],
    },
    terms: [
        {
            field: ["data", "user"],
        },
        {
            field: ["data", "saved"],
            value: true,
        }
    ],
    values: [
        {
            field: ["data", "savedAt"],
            reverse: true,
        },
        {
            field: ["data", "publication"],
        }
    ],
    serialized: true,
}); 