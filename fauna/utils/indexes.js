CreateIndex({
  name: "comments_sorted_created",
  source: Collection("comments"),
  terms: [
    {
      field: ["ref"],
    },
  ],
  values: [
    {
      field: ["data", "created"],
      reverse: true,
    },
    {
      field: ["ref"],
    },
  ],
  serialized: true
})

CreateIndex({
  name: "content_sorted_created",
  source: {
    collection: [Collection("articles"), Collection("memoramas"), Collection("questions")],
  },
  terms: [
    {
      field: ["ref"],
    },
  ],
  values: [
    {
      field: ["data", "created"],
      reverse: true,
    },
    {
      field: ["ref"],
    },
  ],
  serialized: true
})

CreateIndex(
  {
    name: "all_content",
    source: {
      collection: [Collection("articles"), Collection("memoramas"), Collection("questions")],
    },
    serialized: true,
  }
)