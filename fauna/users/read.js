/** @format */
import { query } from "faunadb";
import { GetMinimalContentWithoutAuthor, GetContentCreatedAfterCursor } from "../content/read";

const {
  CurrentIdentity,
  Paginate,
  Lambda,
  Get,
  Var,
  Select,
  Let,
  Match,
  Index,
  Join,
  If,
  Exists,
  Map,
  Update,
  Add,
  Create,
  Collection,
  Now,
  SubString,
  Count,
  Time,
  TimeDiff,
  Multiply,
} = query;
// cursors
const GetUserPopularityCursor = (userRef) => Let(
  {
    user: Get(userRef),
    ageFactor: 1,
    viewFactor: 2,
    readFactor: 3,
    likeFactor: 4,
    dislikeFactor: -5,
    commentFactor: 6,
    saveFactor: 7,
    followerFactor: 8,

    joinTime: Select(["data", "joined"], Var("user")),
    referenceTime: Time("2022-01-01T00:00:00+00:00"),

    age: TimeDiff(Var("referenceTime"), Var("joinTime"), "hours"),
    viewCount: Select(["data", "stats", "viewCount"], Var("user")),
    readCount: Select(["data", "stats", "readCount"], Var("user")),
    likeCount: Select(["data", "stats", "likeCount"], Var("user")),
    dislikeCount: Select(["data", "stats", "dislikeCount"], Var("user")),
    commentCount: Select(["data", "stats", "commentCount"], Var("user")),
    saveCount: Select(["data", "stats", "saveCount"], Var("user")),
    followerCount: Select(["data", "stats", "followerCount"], Var("user")),
  },
  [
    Add(
      Multiply(Var("ageFactor"), Var("age")),
      Multiply(Var("viewFactor"), Var("viewCount")),
      Multiply(Var("readFactor"), Var("readCount")),
      Multiply(Var("likeFactor"), Var("likeCount")),
      Multiply(Var("dislikeFactor"), Var("dislikeCount")),
      Multiply(Var("commentFactor"), Var("commentCount")),
      Multiply(Var("saveFactor"), Var("saveCount")),
      Multiply(Var("followerFactor"), Var("followerCount"))
    ),
    userRef
  ]
)


const GetFollowingStatusStalk = (authorRef) => Let(
  {
    viewerRef: Select(["ref"], GetViewer()),

    authorStatsMatch: Match(Index("authorstats_by_user"), [authorRef, Var("viewerRef")]),
    originalAuthorStats: If(Exists(Var("authorStatsMatch")), Get(Var("authorStatsMatch")), null),
    updatedAuthorStats: If(
      Exists(Var("authorStatsMatch")),
      Update(Select(["ref"], Var("originalAuthorStats")), {
        data: {
          stalkCount: Add(Select(["data", "stalkCount"], Var("originalAuthorStats"), 0), 1),
        }
      }),
      Create(Collection("authorstats"), {
        data: {
          author: authorRef,
          user: Var("viewerRef"),
          stalkCount: 1,
          created: Now(),
        }
      })
    )
  },
  Select(["data", "following"], Var("updatedAuthorStats"), false)
);

export function StalkUser(username) {
  return Let(
    {
      userMatch: Match(Index("user_by_username"), [username]),
      user: Get(Var("userMatch")),
      updatedUser: Update(Select(["ref"], Var("user")), {
        data: {
          stats: {
            stalkCount: Add(Select(["data", "stats", "stalkCount"], Var("user"), 0), 1)
          }
        }
      }),
      following: GetFollowingStatusStalk(Select(["ref"], Var("user"))),
    },
    {
      name: Select(["data", "name"], Var("user")),
      username: Select(["data", "username"], Var("user")),
      about: Select(["data", "about"], Var("user")),
      picture: Select(["data", "picture"], Var("user")),
      stats: {
        followerCount: Select(["data", "stats", "followerCount"], Var("user"), 0),
        followingCount: Select(["data", "stats", "followingCount"], Var("user"), 0),
        likeCount: Select(["data", "stats", "likeCount"], Var("user"), 0),
        following: Var("following"),

      },
      joined: Select(["data", "joined"], Var("user")),
    }
  )
}

export function GetUserByUsername(username) {
  return Get(Match(Index("user_by_username"), [username]));
}

export function GetViewerRef() {
  return Select(["data", 0], Paginate(
    Match(
      Index("userRef_by_accountConnection"),
      CurrentIdentity()
    )
  ))
}

export function GetViewer() {
  return Get(GetViewerRef());
}

export function GetMinimalUser(userRef) {
  return Let(
    {
      user: Get(userRef),
    },
    {
      username: Select(["data", "username"], Var("user")),
      name: Select(["data", "name"], Var("user")),
      picture: Select(["data", "picture"], Var("user")),
    }
  );
}

const ViewContent = (contentRef, viewerRef) => Let(
  {
    content: Update(contentRef, {
      data: {
        stats: {
          viewCount: Add(Select(["data", "stats", "viewCount"], Get(contentRef), 0), 1),
        },
      },
    }),
    viewerStatsMatch: Match(Index("contentstats_by_user"), [contentRef, viewerRef]),
    originalViewerStats: If(Exists(Var("viewerStatsMatch")), Get(Var("viewerStatsMatch")), false),
    viewerStats: If(
      Exists(Var("viewerStatsMatch")),
      Update(Select(["ref"], Var("originalViewerStats")), {
        data: {
          viewCount: Add(Select(["data", "viewCount"], Var("originalViewerStats"), 0), 1),
          lastView: Now(),
        },
      }),
      Create(Collection("contentstats"), {
        data: {
          content: contentRef,
          user: viewerRef,
          viewCount: 1,
          firstView: Now(),
        }
      })
    )
  },
  {
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
    viewerStats: {
      like: Select(["data", "like"], Var("viewerStats"), false),
      dislike: Select(["data", "dislike"], Var("viewerStats"), false),
      save: Select(["data", "save"], Var("viewerStats"), false),
      comment: If(Select(["data", "commentCount"], Var("viewerStats"), 0) > 0, true, false),
      cheer: If(Select(["data", "cheerCount"], Var("viewerStats"), 0) > 0, true, false),
    },
  }
)

export function ViewUserContent(username, afterRef) {
  return Let(
    {
      user: GetUserByUsername(username),
      userRef: Select(["ref"], Var("user")),
      viewer: GetViewer(),
      viewerRef: Select(["ref"], Var("viewer")),
      content: Map(
        Paginate(
          Join(
            Match(Index("content_by_author"), Var("userRef")),
            Index("content_sorted_created")
          ),
          {
            size: 10,
            after: afterRef != null && GetContentCreatedAfterCursor(afterRef),
          }
        ),
        Lambda(["created", "ref"], ViewContent(Var("ref"), Var("viewerRef")))
      ),
      contentCount: Select(["data", 0], Count(Var("content"))),
      userUpdated: Update(Var("userRef"), {
        data: {
          stats: {
            viewCount: Add(Select(["data", "stats", "viewCount"], Var("user"), 0), Var("contentCount")),
          },
        },
      }),
      authorStatsMatch: Match(Index("authorstats_by_user"), [Var("userRef"), Var("viewerRef")]),
      originalAuthorStats: Get(Var("authorStatsMatch")),
      authorStats: Update(Select(["ref"], Var("originalAuthorStats")), {
        data: {
          viewCount: Add(Select(["data", "viewCount"], Var("originalAuthorStats"), 0), Var("contentCount")),
        }
      })
    },
    Var("content")
  )
}

export function GetSuggestedUsers(afterRef) {
  return Map(
    Paginate(
      Join(
        Match(Index("all_users")),
        Index("users_sorted_popularity")
      ),
      {
        size: 20,
        after: afterRef != null && GetUserPopularityCursor(afterRef),
      }
    ),
    Lambda(["score", "ref"], GetMinimalUser(Var("ref")))
  );
}

export function GetFollowers(username, afterRef) {
  return Map(
    Paginate(
      Join(
        Match(Index("followers_by_author"), [Select(["ref"], GetUserByUsername(username)), true]),
        Index("users_sorted_popularity")
      ),
      {
        size: 20,
        after: afterRef != null && GetUserPopularityCursor(afterRef),
      }
    ),
    Lambda(["created", "ref"], GetMinimalUser(Var("ref")))
  );
}