CreateIndex({
    name: "publications_sorted_publishedAt",
    source: Collection("publications"),
    terms: [
        {
            field: ["ref"],
        },
    ],
    values: [
        {
            field: ["data", "publishedAt"],
            reverse: true,
        },
        {
            field: ["ref"],
        },
    ],
    serialized: true
})