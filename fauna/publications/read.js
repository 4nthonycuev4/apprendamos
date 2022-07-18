/** @format */

import { query } from "faunadb";

import { GetPartialUser, GetUserByUsername, GetUserRefByUsername, GetViewer, GetViewerRef } from "../users/read";

const { Let, Select, Index, Get, If, Var, Exists, Match, Paginate, Map, Multiply, TimeDiff, Add, Join, Collection, Time, Lambda, Update, Now, Create, SubString, Take, Count, Documents } = query;

const GetPublicationPublishedAtCursor = (ref) => ([Select(["data", "publishedAt"], Get(ref)), ref]);

const GetPublicationViewerStats = (publicationRef, viewerRef) => Let(
  {
    publicationViewerRelMatch: Match(Index("publication_user_rel"), [publicationRef, viewerRef]),
    publicationViewerRel: If(Exists(Var("publicationViewerRelMatch")), Get(Var("publicationViewerRelMatch")), false),
  },
  If(
    Exists(Var("publicationViewerRelMatch")),
    {
      like: Select(["data", "like"], Var("publicationViewerRel"), false),
      dislike: Select(["data", "dislike"], Var("publicationViewerRel"), false),
      save: Select(["data", "save"], Var("publicationViewerRel"), false),
      comment: If(Select(["data", "commentCount"], Var("publicationViewerRel"), 0) > 0, true, false),
      cheer: If(Select(["data", "cheerCount"], Var("publicationViewerRel"), 0) > 0, true, false),
    },
    null
  )
);

const GetPublicationViewerStatsRead = (publicationRef, authorRef) => Let(
  {
    viewerRef: GetViewerRef(),
    viewerStatsMatch: Match(Index("publicationstats_by_user"), [publicationRef, Var("viewerRef")]),
    originalViewerStats: If(Exists(Var("viewerStatsMatch")), Get(Var("viewerStatsMatch")), false),
    viewerStats: If(
      Exists(Var("viewerStatsMatch")),
      Update(Select(["ref"], Var("originalViewerStats")), {
        data: {
          readCount: Add(Select(["data", "readCount"], Var("originalViewerStats")), 1),
          lastView: Now(),
        },
      }),
      Create(Collection("publicationstats"), {
        data: {
          publication: publicationRef,
          user: Var("viewerRef"),
          readCount: 1,
          firstRead: Now(),
        }
      })
    ),

    authorStatsMatch: Match(Index("authorstats_by_user"), [authorRef, Var("viewerRef")]),
    originalAuthorStats: If(Exists(Var("authorStatsMatch")), Get(Var("authorStatsMatch")), false),
    authorStats: If(
      Exists(Var("authorStatsMatch")),
      Update(Select(["ref"], Var("originalAuthorStats")), {
        data: {
          readCount: Add(Select(["data", "readCount"], Var("originalAuthorStats")), 1),
        }
      }),
      Create(Collection("authorstats"), {
        data: {
          author: authorRef,
          user: Var("viewerRef"),
          readCount: 1,
          created: Now(),
        }
      })
    )
  },
  {
    like: Select(["data", "like"], Var("viewerStats"), false),
    dislike: Select(["data", "dislike"], Var("viewerStats"), false),
    save: Select(["data", "save"], Var("viewerStats"), false),
    comment: If(Select(["data", "commentCount"], Var("viewerStats"), 0) > 0, true, false),
    cheer: If(Select(["data", "cheerCount"], Var("viewerStats"), 0) > 0, true, false),
    followingAuthor: Select(["data", "following"], Var("authorStats"), false),
  }
);

export const GetSinglePublication = (ref) => Let(
  {
    publication: Update(ref, {
      data: {
        stats: {
          readCount: Add(Select(["data", "stats", "readCount"], Get(ref), 0), 1),
        },
        lastReadAt: Now(),
      },
    }),
    author: Update(Select(["data", "author"], Var("publication")), {
      data: {
        stats: {
          readCount: Add(Select(["data", "stats", "readCount"], Get(Select(["data", "author"], Var("publication"))), 0), 1),
        },
      }
    }),
  },
  {
    author: {
      username: Select(["data", "username"], Var("author")),
      name: Select(["data", "name"], Var("author")),
      picture: Select(["data", "picture"], Var("author")),
      followerCount: Select(["data", "stats", "followerCount"], Var("author")),
    },
    id: ref,
    body: Select(["data", "body"], Var("publication")),
    publishedAt: Select(["data", "publishedAt"], Var("publication")),
    updatedAt: Select(["data", "updatedAt"], Var("publication"), false),
  }
)

export const GetPublicationStats = (ref) => Let(
  {
    publication: Get(ref),
  },
  {
    likeCount: Select(["data", "stats", "likeCount"], Var("publication"), null),
    cheerCount: Select(["data", "stats", "cheerCount"], Var("publication"), null),
    commentCount: Select(["data", "stats", "commentCount"], Var("publication"), null),
  }
)

const GetPublicationPopularityCursor = (ref) => Let(
  {
    publication: Get(ref),
    viewFactor: 1,
    ageFactor: 2,
    likeFactor: 3,
    readFactor: 4,
    saveFactor: 5,
    dislikeFactor: -6,
    commentFactor: 7,
    cheerFactor: 8,

    creationTime: Select(["data", "created"], Var("publication")),
    referenceTime: Time("2022-01-01T00:00:00+00:00"),

    viewCount: Select(["data", "stats", "viewCount"], Var("publication")),
    age: TimeDiff(Var("referenceTime"), Var("creationTime"), "hours"),
    likeCount: Select(["data", "stats", "likeCount"], Var("publication")),
    readCount: Select(["data", "stats", "readCount"], Var("publication")),
    saveCount: Select(["data", "stats", "saveCount"], Var("publication")),
    dislikeCount: Select(["data", "stats", "dislikeCount"], Var("publication")),
    commentCount: Select(["data", "stats", "commentCount"], Var("publication")),
    cheerCount: Select(["data", "stats", "cheerCount"], Var("publication")),

  },
  [Add(
    Multiply(Var("viewFactor"), Var("viewCount")),
    Multiply(Var("ageFactor"), Var("age")),
    Multiply(Var("likeFactor"), Var("likeCount")),
    Multiply(Var("readFactor"), Var("readCount")),
    Multiply(Var("saveFactor"), Var("saveCount")),
    Multiply(Var("dislikeFactor"), Var("dislikeCount")),
    Multiply(Var("commentFactor"), Var("commentCount")),
    Multiply(Var("cheerFactor"), Var("cheerCount"))
  ), ref]
)

export const GetPartialPublication = (publicationRef, withAuthor = true) => Let(
  {
    publication: Get(publicationRef),
    author: withAuthor && GetPartialUser(Select(["data", "author"], Var("publication"))),
  },
  {
    id: publicationRef,
    body: SubString(Select(["data", "body"], Var("publication")), 0, 200),
    publishedAt: Select(["data", "publishedAt"], Var("publication")),
    stats: {
      likeCount: Select(["data", "stats", "likeCount"], Var("publication"), null),
      cheerCount: Select(["data", "stats", "cheerCount"], Var("publication"), null),
      commentCount: Select(["data", "stats", "commentCount"], Var("publication"), null),
    },
    tags: Take(2, Select(["data", "tags"], Var("publication"), [])),
    author: Var("author"),
  }
);

export const GetPublications = (afterRef) => Let(
  {
    viewerRef: GetViewerRef(),
  },
  Map(
    Paginate(
      Join(
        Join(
          Match(Index("following_by_user"), [Var("viewerRef"), true]),
          Index("publications_by_author")
        ),
        Index("publications_sorted_popularity")
      ),
      {
        size: 10,
        after: afterRef != null && GetPublicationPopularityCursor(afterRef),
      }
    ),
    Lambda(
      ["score", "ref"],
      GetPartialPublication(Var("ref"), true)
    )
  ),
);

export const GetTrendingPublications = (afterRef) => Let(
  {
    viewerRef: GetViewerRef(),
  },
  Map(
    Paginate(
      Join(Documents(Collection("publications")), Index("publications_sorted_popularity")),
      {
        size: 10,
        after: afterRef != null && GetPublicationPopularityCursor(afterRef),
      }
    ),
    Lambda(
      ["score", "ref"],
      GetPartialPublication(Var("ref"), true, Var("viewerRef"))
    )
  )
);

export const GetUserPublications = (username, afterRef) => Let(
  {
    viewerRef: GetViewerRef(),
    user: GetUserByUsername(username),
    userRef: Select(["ref"], Var("user")),
  },
  Map(
    Paginate(
      Join(
        Match(Index("publications_by_author"), Var("userRef")),
        Index("publications_sorted_publishedAt")
      ),
      {
        size: 10,
        after: afterRef != null && GetPublicationPublishedAtCursor(afterRef),
      }
    ),
    Lambda(
      ["publishedAt", "ref"],
      GetPartialPublication(Var("ref"), false, Var("viewerRef"))
    )
  ),
);

export const GetSavedPublications = (afterRef) => Let(
  {
    viewerRef: Select(["ref"], GetViewer()),
  },
  Map(
    Paginate(
      Match(Index("saved_by_user"), [Var("viewerRef"), true]),
      {
        size: 10,
        after: afterRef != null && GetPublicationPopularityAfterCursor(afterRef),
      }
    ),
    Lambda(
      ["savedAt", "publicationRef"],
      Let(
        {
          publication: Get(Var("publicationRef")),
        },
        {
          publication: Var("publication"),
          savedAt: Var("savedAt"),
        }
      )
    )
  )
);