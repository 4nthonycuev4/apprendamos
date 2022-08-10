CreateIndex({
    name: "saved_publications_by_interactor",
    source: Collection("publicationinteractions"),
    terms: [
        {
            field: ["data", "interactor"],
        },
        {
            field: ["data", "save"],
            value: true,
        },
    ],
    values: [
        {
            field: ["data", "saved_at"],
            reverse: true,
        },
        {
            field: ["data", "publication"],
        },
    ],
    serialized: true,
});
