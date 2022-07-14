CreateIndex({
  name: "publications_sorted_popularity",
  source: {
    collection: Collection("publications"),
    fields: {
      score: Query(
        Lambda(
          "publication",
          Let(
            {
              ageFactor: 1,
              partialViewFactor: 2,
              likeFactor: 3,
              fullViewFactor: 4,
              saveFactor: 5,
              dislikeFactor: -6,
              commentFactor: 7,
              cheerFactor: 8,

              publicationTime: Select(["data", "publishedAt"], Var("publication")),
              referenceTime: Time("2022-01-01T00:00:00+00:00"),

              age: TimeDiff(Var("referenceTime"), Var("publicationTime"), "seconds"),
              partialViewCount: Select(["data", "stats", "partialViewCount"], Var("publication"), 0),
              likeCount: Select(["data", "stats", "likeCount"], Var("publication"), 0),
              fullViewCount: Select(["data", "stats", "fullViewCount"], Var("publication"), 0),
              saveCount: Select(["data", "stats", "saveCount"], Var("publication"), 0),
              dislikeCount: Select(["data", "stats", "dislikeCount"], Var("publication"), 0),
              commentCount: Select(["data", "stats", "commentCount"], Var("publication"), 0),
              cheerCount: Select(["data", "stats", "cheerCount"], Var("publication"), 0),
            },
            Add(
              Multiply(Var("partialViewFactor"), Var("partialViewCount")),
              Multiply(Var("ageFactor"), Var("age")),
              Multiply(Var("likeFactor"), Var("likeCount")),
              Multiply(Var("fullViewFactor"), Var("fullViewCount")),
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