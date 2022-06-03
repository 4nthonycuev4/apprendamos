CreateIndex({
    name: "saved_by_user",
    source: {
        collection: [Collection("contentstats")],
    },
    terms: [
        {
            field: ["data", "user"],
        },
        {
            field: ["data", "save"],
            value: true,
        }
    ],
    values: [
        {
            field: ["data", "saved"],
            reverse: true,
        },
        {
            field: ["data", "content"],
        }
    ],
    serialized: true,
});