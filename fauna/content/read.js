/** @format */

import { query } from "faunadb";

import { GetContentComments } from "../comments/read";
import { GetMinimalUser, GetUserRefByUsername, GetViewer, GetViewerRef } from "../users/read";

const { Let, Select, Index, Get, If, Var, Exists, Match, Paginate, Map, Multiply, TimeDiff, Add, Join, Collection, Time, Lambda, Update, Now, Create, SubString } = query;

export const GetContentCreatedAfterCursor = (ref) => ([Select(["data", "created"], Get(ref)), ref]);

const GetContentViewerStatsView = (contentRef, authorRef, viewerRef) => Let(
  {
    viewerStatsMatch: Match(Index("contentstats_by_user"), [contentRef, viewerRef]),
    originalViewerStats: If(Exists(Var("viewerStatsMatch")), Get(Var("viewerStatsMatch")), false),
    viewerStats: If(
      Exists(Var("viewerStatsMatch")),
      Update(Select(["ref"], Var("originalViewerStats")), {
        data: {
          viewCount: Add(Select(["data", "viewCount"], Var("originalViewerStats")), 1),
          lastView: Now(),
        },
      }),
      Create(Collection("contentstats"), {
        data: {
          content: contentRef,
          user: viewerRef,
          like: false,
          dislike: false,
          save: false,
          commentCount: 0,
          cheerCount: 0,
          readCount: 0,
          viewCount: 1,
          firstView: Now(),
        }
      })
    ),

    authorStatsMatch: Match(Index("authorstats_by_user"), [authorRef, viewerRef]),
    originalAuthorStats: If(Exists(Var("authorStatsMatch")), Get(Var("authorStatsMatch")), false),
    authorStats: If(
      Exists(Var("authorStatsMatch")),
      Update(Select(["ref"], Var("originalAuthorStats")), {
        data: {
          viewCount: Add(Select(["data", "viewCount"], Var("originalAuthorStats")), 1),
        }
      }),
      Create(Collection("authorstats"), {
        data: {
          author: authorRef,
          user: viewerRef,
          following: false,
          viewCount: 1,
          readCount: 0,
          saveCount: 0,
          likeCount: 0,
          dislikeCount: 0,
          commentCount: 0,
          cheerCount: 0,
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
  })

const GetContentViewerStatsRead = (contentRef, authorRef) => Let(
  {
    viewerRef: GetViewerRef(),
    viewerStatsMatch: Match(Index("contentstats_by_user"), [contentRef, Var("viewerRef")]),
    originalViewerStats: If(Exists(Var("viewerStatsMatch")), Get(Var("viewerStatsMatch")), false),
    viewerStats: If(
      Exists(Var("viewerStatsMatch")),
      Update(Select(["ref"], Var("originalViewerStats")), {
        data: {
          readCount: Add(Select(["data", "readCount"], Var("originalViewerStats")), 1),
          lastView: Now(),
        },
      }),
      Create(Collection("contentstats"), {
        data: {
          content: contentRef,
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

export const ReadContent = (ref) => Let(
  {
    content: Update(ref, {
      data: {
        stats: {
          readCount: Add(Select(["data", "stats", "readCount"], Get(ref), 0), 1),
        },
      },
    }),
    author: Update(Select(["data", "author"], Var("content")), {
      data: {
        stats: {
          readCount: Add(Select(["data", "stats", "readCount"], Get(Select(["data", "author"], Var("content"))), 0), 1),
        },
      }
    }),
    viewerStats: GetContentViewerStatsRead(ref, Select(["data", "author"], Var("content"))),
  },
  {
    author: {
      username: Select(["data", "username"], Var("author")),
      name: Select(["data", "name"], Var("author")),
      picture: Select(["data", "picture"], Var("author")),
    },
    id: ref,
    title: Select(["data", "title"], Var("content")),
    flashcards: Select(["data", "flashcards"], Var("content"), null),
    body: Select(["data", "body"], Var("content")),
    created: Select(["data", "created"], Var("content")),
    updated: Select(["data", "updated"], Var("content"), false),
    stats: {
      likeCount: Select(["data", "stats", "likeCount"], Var("content"), 0),
      cheerCount: Select(["data", "stats", "cheerCount"], Var("content"), 0),
      commentCount: Select(["data", "stats", "commentCount"], Var("content"), 0),
    },
    viewerStats: Var("viewerStats"),
  }
)

const GetContentPopularityAfterCursor = (ref) => Let(
  {
    content: Get(ref),
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

export const ViewContent = (contentRef, viewerRef) => Let(
  {
    content: Update(contentRef, {
      data: {
        stats: {
          viewCount: Add(Select(["data", "stats", "viewCount"], Get(contentRef), 0), 1),
        },
      },
    }),
    author: Update(Select(["data", "author"], Var("content")), {
      data: {
        stats: {
          viewCount: Add(Select(["data", "stats", "viewCount"], Get(Select(["data", "author"], Var("content"))), 0), 1),
        },
      }
    }),
    viewerStats: GetContentViewerStatsView(contentRef, Select(["data", "author"], Var("content")), viewerRef),
  },
  {
    author: {
      name: Select(["data", "name"], Var("author")),
      username: Select(["data", "username"], Var("author")),
      picture: Select(["data", "picture"], Var("author")),
    },
    id: contentRef,
    title: Select(["data", "title"], Var("content")),
    flashcards: Select(["data", "flashcards"], Var("content"), null),
    body: SubString(Select(["data", "body"], Var("content")), 0, 200),
    created: Select(["data", "created"], Var("content")),
    stats: {
      likeCount: Select(["data", "stats", "likeCount"], Var("content"), 0),
      cheerCount: Select(["data", "stats", "cheerCount"], Var("content"), 0),
      commentCount: Select(["data", "stats", "commentCount"], Var("content"), 0),
    },
    viewerStats: Var("viewerStats"),
  }
)

export const GetMinimalContentWithoutAuthor = (ref) => Let(
  {
    content: Get(ref),
  },
  {
    id: ref,
    title: Select(["data", "title"], Var("content")),
    body: Select(["data", "body"], Var("content")),
    created: Select(["data", "created"], Var("content")),
  }
)


export const FollowingContent = (afterRef) => Let(
  {
    viewerRef: GetViewerRef(),
    content: Map(
      Paginate(
        Join(
          Join(
            Match(Index("following_by_user"), [Var("viewerRef"), true]),
            Index("content_by_author")
          ),
          Index("content_sorted_popularity")
        ),
        {
          size: 10,
          after: afterRef != null && GetContentPopularityAfterCursor(afterRef),
        }
      ),
      Lambda(
        ["score", "ref"],
        ViewContent(Var("ref"), Var("viewerRef"))
      )
    ),
  },
  Var("content")
);


export const ViewTrendingContent = (afterRef) => Let(
  {
    viewerRef: Select(["ref"], GetViewer()),
    content: Map(
      Paginate(
        Join(Match(Index("all_content")), Index("content_sorted_popularity")),
        {
          size: 10,
          after: afterRef != null && GetContentPopularityAfterCursor(afterRef),
        }
      ),
      Lambda(
        ["score", "ref"],
        ViewContent(Var("ref"), Var("viewerRef"))
      )
    ),
  },
  Var("content")
);

export const ViewSavedContent = (afterRef) => Let(
  {
    viewerRef: Select(["ref"], GetViewer()),
    content: Map(
      Paginate(
        Match(Index("saved_by_user"), [Var("viewerRef"), true]),
        {
          size: 10,
          after: afterRef != null && GetContentPopularityAfterCursor(afterRef),
        }
      ),
      Lambda(
        ["saved", "contentRef"],
        ViewContent(Var("contentRef"), Var("viewerRef"))
      )
    )
  },
  Var("content")
)


