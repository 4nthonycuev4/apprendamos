/** @format */

import { query } from "faunadb";

import { GetContentComments } from "../comments/read";
import { GetMinimalUser, GetUserRefByUsername } from "../user/read";

const { Let, Select, Index, Get, If, Var, Exists, Match, Paginate, Map, Multiply, TimeDiff, Add, Join, Ref, Collection, Time, Lambda } = query;

export const GetContentCreatedAfterCursor = (ref) => If(
  Exists(ref),
  [Select(["data", "created"], Get(ref)), ref],
);

const GetContentPopularityAfterCursor = (ref) => Let(
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
  [
    Add(
      Multiply(Var("likesfactor"), Var("likes")),
      Multiply(Var("commentsFactor"), Var("comments")),
      Multiply(Var("ageFactor"), Var("relativeAge"))
    ),
    ref
  ]
)



export const GetMinimalContent = (ref) => Let(
  {
    content: Get(ref),
    author: GetMinimalUser(Select(["data", "author"], Var("content"))),
  },
  {
    author: Var("author"),
    faunaRef: ref,
    title: Select(["data", "title"], Var("content")),
    body: Select(["data", "body"], Var("content")),
    created: Select(["data", "created"], Var("content")),
  }
)

export const GetMinimalContentWithoutAuthor = (ref) => Let(
  {
    content: Get(ref),
  },
  {
    faunaRef: ref,
    title: Select(["data", "title"], Var("content")),
    body: Select(["data", "body"], Var("content")),
    created: Select(["data", "created"], Var("content")),
  }
)

export const GetContentList = (afterRef) => Map(
  Paginate(
    Join(Match(Index("all_content")), Index("content_sorted_popularity")),
    {
      size: 5,
      after: afterRef != null &&
        GetContentPopularityAfterCursor(afterRef)
    }
  ),
  Lambda(
    ["score", "ref"],
    GetMinimalContent(Var("ref"))
  )
);


export const GetContent = (contentRef) => Let(
  {
    content: Get(contentRef),

    authorRef: Select(["data", "authorRef"], Var("content")),
    author: GetMinimalUser(Var("authorRef")),

    comments: GetContentComments(contentRef, docType, comments),

    viewerRef: viewerUsername ? GetUserRefByUsername(viewerUsername) : null,

    viewerContentStatsMatch: viewerUsername
      ? Match(
        Index(`stats_by_${docType}Ref_and_userRef`),
        contentRef,
        Var("viewerRef")
      )
      : null,

    viewerStats: viewerUsername
      ? If(
        Exists(Var("viewerContentStatsMatch")),
        Get(Var("viewerContentStatsMatch")),
        { ref: "not_found" }
      )
      : null,
  },
  {
    content: Var("content"),
    author: Var("author"),
    comments: Var("comments"),
    viewerRef: Var("viewerRef"),
    viewerStats: Var("viewerStats"),
  }
)
