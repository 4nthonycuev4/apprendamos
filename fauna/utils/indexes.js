/** @format */

import { CreateIndex, Query } from "faunadb";
import { Select } from 'faunadb';


const GetContentPopularityAfterCursor = (ref) = Let(
  {
    content: Get(ref),
    ageFactor: 1,
    viewsFactor: 2,
    likesfactor: 3,
    savedFactor: 4,
    commentsFactor: 5,

    likes: Select(["data", "stats", "likes"], Var("content")),
    comments: Select(["data", "stats", "comments"], Var("content")),

    creationTime: Select(["data", "created"], Var("content")),
    referenceTime: Time("2022-01-01T00:00:00+00:00"),
    relativeAge: TimeDiff(
      Var("referenceTime"),
      Var("creationTime"),
      "hours"
    ),
  },
  Add(
    Multiply(Var("likesfactor"), Var("likes")),
    Multiply(Var("commentsFactor"), Var("comments")),
    Multiply(Var("ageFactor"), Var("relativeAge"))
  )
)

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
              ageFactor: 1,
              viewsFactor: 2,
              likesfactor: 3,
              savedFactor: 4,
              commentsFactor: 5,

              likes: Select(["data", "stats", "likes"], Var("content")),
              comments: Select(["data", "stats", "comments"], Var("content")),

              creationTime: Select(["data", "created"], Var("content")),
              referenceTime: Time("2022-01-01T00:00:00+00:00"),
              relativeAge: TimeDiff(
                Var("referenceTime"),
                Var("creationTime"),
                "hours"
              ),
            },
            Add(
              Multiply(Var("likesfactor"), Var("likes")),
              Multiply(Var("commentsFactor"), Var("comments")),
              Multiply(Var("ageFactor"), Var("relativeAge"))
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

CreateIndex({
  name: "content_by_tag",
  source: {
    collection: [Collection("articles"), Collection("memoramas")],
    fields: {
      score: Query(
        Lambda(
          "content",
          Let(
            {
              likesfactor: 40,
              commentsFactor: 50,
              ageFactor: 0.005,

              likes: Select(["data", "stats", "likes"], Var("content")),
              comments: Select(["data", "stats", "comments"], Var("content")),

              txtime: Select(["data", "created"], Var("content")),
              unixstarttime: Time("1970-01-01T00:00:00+00:00"),
              ageInSecsSinceUnix: TimeDiff(
                Var("unixstarttime"),
                Var("txtime"),
                "minutes"
              ),
            },
            Add(
              Multiply(Var("likesfactor"), Var("likes")),
              Multiply(Var("commentsFactor"), Var("comments")),
              Multiply(Var("ageFactor"), Var("ageInSecsSinceUnix"))
            )
          )
        )
      ),
    },
  },
  terms: [
    {
      field: ["data", "tags", "parsed"],
    },
  ],
  values: [
    {
      binding: "score",
      reverse: true,
    },
    {
      field: ["ref"],
    },
  ],
  serialized: true,
});

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