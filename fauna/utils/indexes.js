/** @format */

import { Create, CreateIndex, Query } from "faunadb";
import { Select } from 'faunadb';

CreateIndex({
  name: "content_sorted_popularity",
  source: {
    collection: [Collection("Posts"), Collection("Flashquizzes"), Collection("Questions")],
    fields: {
      score: Query(
        Lambda(
          "content",
          Let(
            {
              likesfactor: 4,
              commentsFactor: 5,
              ageFactor: 1,

              likes: Select(["data", "stats", "likes"], Var("content")),
              comments: Select(["data", "stats", "comments"], Var("content")),

              txtime: Select(["data", "created"], Var("content")),
              unixstarttime: Time("2020-01-01T00:00:00+00:00"),
              ageInSecsSinceUnix: TimeDiff(
                Var("unixstarttime"),
                Var("txtime"),
                "hour"
              ),
            },
            Add(
              Multiply(Var("likesfactor"), Var("likes")),
              Multiply(Var("commentsFactor"), Var("comments")),
              Multiply(Var("ageFactor"), Var("ageInSecsSinceUnix"))
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
    },
    {
      field: ["data", "title"],
    },
    {
      field: ["data", "body"],
    },
    {
      field: ["data", "created"],
    },
    {
      field: ["data", "authorRef"],
    }
  ],
  serialized: true,
});

CreateIndex({
  name: "content_by_tag",
  source: {
    collection: [Collection("Posts"), Collection("Flashquizzes")],
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
  source: {
    collection: [Collection("CommentsPost"), Collection("CommentsFlashquiz"), Collection("CommentsQuestion")],
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
    {
      field: ["data", "message"],
    },
    {
      field: ["data", "coins"],
    },
    {
      field: ["data", "authorRef"],
    },
  ],
  serialized: true
})

CreateIndex({
  name: "content_sorted_created",
  source: {
    collection: [Collection("Posts"), Collection("Flashquizzes"), Collection("Questions")],
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
    {
      field: ["data", "title"],
    },
    {
      field: ["data", "body"],
    },
    {
      field: ["data", "authorRef"],
    },
  ],
  serialized: true
})