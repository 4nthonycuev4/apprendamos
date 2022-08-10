CreateIndex({
    name: "author_following",
    source: Collection("authorinteractions"),
    terms: [
        {
            field: ["data", "interactor"],
        },
        {
            field: ["data", "follow"],
        },
    ],
    values: [
        {
            field: ["data", "author"],
            reverse: true,
        },
    ],
    serialized: true,
});
