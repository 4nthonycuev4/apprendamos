/** @format */
import { query } from "faunadb";

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
    HasCurrentIdentity,
} = query;

// cursors
const GetAuthorPopularityCursor = (authorRef) =>
    Let(
        {
            author: Get(authorRef),
            ageFactor: 1,
            viewFactor: 2,
            readFactor: 3,
            likeFactor: 4,
            dislikeFactor: -5,
            commentFactor: 6,
            saveFactor: 7,
            followerFactor: 8,

            joinTime: Select(["data", "joined"], Var("author")),
            referenceTime: Time("2022-01-01T00:00:00+00:00"),

            age: TimeDiff(Var("referenceTime"), Var("joinTime"), "hours"),
            viewCount: Select(["data", "stats", "viewCount"], Var("author")),
            readCount: Select(["data", "stats", "readCount"], Var("author")),
            likeCount: Select(["data", "stats", "likeCount"], Var("author")),
            dislikeCount: Select(
                ["data", "stats", "dislikeCount"],
                Var("author")
            ),
            commentCount: Select(
                ["data", "stats", "commentCount"],
                Var("author")
            ),
            saveCount: Select(["data", "stats", "saveCount"], Var("author")),
            followerCount: Select(
                ["data", "stats", "followerCount"],
                Var("author")
            ),
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
            authorRef,
        ]
    );

export const GetFollowingStatus = (nickname) =>
    Let(
        {
            viewerRef: GetViewerRef(),
            author: GetAuthorBynickname(nickname),
            authorAuthorRelMatch: Match(Index("author_author_rel"), [
                Select(["ref"], Var("author")),
                Var("viewerRef"),
            ]),
            following: If(
                Exists(Var("authorAuthorRelMatch")),
                Select(
                    ["data", "following"],
                    Get(Var("authorAuthorRelMatch")),
                    false
                ),
                false
            ),
        },
        {
            following: Var("following"),
        }
    );

export const StalkAuthor = (nickname) =>
    Let(
        {
            authorMatch: Match(Index("author_by_nickname"), [nickname]),
            author: Get(Var("authorMatch")),
            updatedAuthor: Update(Select(["ref"], Var("author")), {
                data: {
                    stats: {
                        stalkCount: Add(
                            Select(
                                ["data", "stats", "stalkCount"],
                                Var("author"),
                                0
                            ),
                            1
                        ),
                    },
                },
            }),
            following: GetFollowingStatusStalk(Select(["ref"], Var("author"))),
        },
        {
            name: Select(["data", "name"], Var("author")),
            nickname: Select(["data", "nickname"], Var("author")),
            about: Select(["data", "about"], Var("author")),
            picture: Select(["data", "picture"], Var("author")),
            stats: {
                followerCount: Select(
                    ["data", "stats", "followerCount"],
                    Var("author"),
                    0
                ),
                followingCount: Select(
                    ["data", "stats", "followingCount"],
                    Var("author"),
                    0
                ),
                likeCount: Select(
                    ["data", "stats", "likeCount"],
                    Var("author"),
                    0
                ),
                following: Var("following"),
            },
            joined: Select(["data", "joined"], Var("author")),
        }
    );

export const GetAuthorBynickname = (nickname) =>
    Get(Match(Index("author_by_nickname"), [nickname]));

export const GetAuthorRefBynickname = (nickname) =>
    Select(["ref"], GetAuthorBynickname(nickname));

export const GetSingleAuthor = (nickname) =>
    Let(
        {
            author: GetAuthorBynickname(nickname),
        },
        {
            name: Select(["data", "name"], Var("author")),
            nickname: Select(["data", "nickname"], Var("author")),
            about: Select(["data", "about"], Var("author")),
            picture: Select(["data", "picture"], Var("author")),
            joinedAt: Select(["data", "joinedAt"], Var("author")),
            stats: {
                followerCount: Select(
                    ["data", "stats", "followerCount"],
                    Var("author"),
                    0
                ),
                followingCount: Select(
                    ["data", "stats", "followingCount"],
                    Var("author"),
                    0
                ),
                likeCount: Select(
                    ["data", "stats", "likeCount"],
                    Var("author"),
                    0
                ),
            },
        }
    );

export function GetViewer() {
    return Get(Match(Index("author_by_user_id"), [CurrentIdentity()]));
}

export const GetViewerRef = () => Select(["ref"], GetViewer());

export const GetPartialAuthor = (authorRef) =>
    Let(
        {
            author: Get(authorRef),
        },
        {
            nickname: Select(["data", "nickname"], Var("author")),
            name: Select(["data", "name"], Var("author")),
            picture: Select(["data", "picture"], Var("author")),
        }
    );

export function GetSuggestedAuthors(afterRef) {
    return Map(
        Paginate(
            Join(
                Join(
                    Match(Index("following_by_author"), GetViewerRef()),
                    Match(Index("following_by_author"))
                ),
                Index("authors_sorted_popularity")
            ),
            {
                size: 20,
                after: afterRef != null && GetAuthorPopularityCursor(afterRef),
            }
        ),
        Lambda(["score", "ref"], GetPartialAuthor(Var("ref")))
    );
}

export function GetFollowers(nickname, afterRef) {
    return Map(
        Paginate(
            Join(
                Match(Index("followers_by_author"), [
                    Select(["ref"], GetAuthorBynickname(nickname)),
                    true,
                ]),
                Index("authors_sorted_popularity")
            ),
            {
                size: 20,
                after: afterRef != null && GetAuthorPopularityCursor(afterRef),
            }
        ),
        Lambda(["created", "ref"], GetPartialAuthor(Var("ref")))
    );
}

export const GetTrendingAuthors = (afterRef) =>
    Map(
        Paginate(
            Join(
                Match(Index("blocked_authors"), [false]),
                Index("authors_sorted_popularity")
            ),
            {
                size: 20,
                after: afterRef != null && GetAuthorPopularityCursor(afterRef),
            }
        ),
        Lambda(["score", "ref"], GetPartialAuthor(Var("ref")))
    );
