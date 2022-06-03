CreateIndex({
  name: "content_sorted_popularity",
  source: {
    collection: [Collection("articles"), Collection("memoramas"), Collection("questions")],
    fields: {
      score: Query(
        Lambda(
          "content",
          Let(
            {
              viewFactor: 1,
              ageFactor: 2,
              likeFactor: 3,
              readFactor: 4,
              saveFactor: 5,
              dislikeFactor: -6,
              commentFactor: 7,
              cheerFactor: 8,

              creationTime: Select(["data", "created"], Var("content")),
              referenceTime: Time("2022-01-01T00:00:00+00:00"),

              viewCount: Select(["data", "stats", "viewCount"], Var("content")),
              age: TimeDiff(Var("referenceTime"), Var("creationTime"), "hours"),
              likeCount: Select(["data", "stats", "likeCount"], Var("content")),
              readCount: Select(["data", "stats", "readCount"], Var("content")),
              saveCount: Select(["data", "stats", "saveCount"], Var("content")),
              dislikeCount: Select(["data", "stats", "dislikeCount"], Var("content")),
              commentCount: Select(["data", "stats", "commentCount"], Var("content")),
              cheerCount: Select(["data", "stats", "cheerCount"], Var("content")),

            },
            Add(
              Multiply(Var("viewFactor"), Var("viewCount")),
              Multiply(Var("ageFactor"), Var("age")),
              Multiply(Var("likeFactor"), Var("likeCount")),
              Multiply(Var("readFactor"), Var("readCount")),
              Multiply(Var("saveFactor"), Var("saveCount")),
              Multiply(Var("dislikeFactor"), Var("dislikeCount")),
              Multiply(Var("commentFactor"), Var("commentCount")),
              Multiply(Var("cheerFactor"), Var("cheerCount"))
            )
          )
        )
      )
    },
  },
  terms: [
    {
      field: ["ref"],
    },
  ],
  values: [
    {
      binding: "score",
      reverse: true,
    },
    {
      field: ["ref"],
    }
  ],
  serialized: true,
});