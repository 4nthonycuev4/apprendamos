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
const GetUserPopularityCursor = (userRef) =>
    Let(
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
            dislikeCount: Select(
                ["data", "stats", "dislikeCount"],
                Var("user")
            ),
            commentCount: Select(
                ["data", "stats", "commentCount"],
                Var("user")
            ),
            saveCount: Select(["data", "stats", "saveCount"], Var("user")),
            followerCount: Select(
                ["data", "stats", "followerCount"],
                Var("user")
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
            userRef,
        ]
    );

export const GetFollowingStatus = (username) =>
    Let(
        {
            viewerRef: GetViewerRef(),
            user: GetUserByUsername(username),
            authorUserRelMatch: Match(Index("author_user_rel"), [
                Select(["ref"], Var("user")),
                Var("viewerRef"),
            ]),
            following: If(
                Exists(Var("authorUserRelMatch")),
                Select(
                    ["data", "following"],
                    Get(Var("authorUserRelMatch")),
                    false
                ),
                false
            ),
        },
        {
            following: Var("following"),
        }
    );

export const StalkUser = (username) =>
    Let(
        {
            userMatch: Match(Index("user_by_username"), [username]),
            user: Get(Var("userMatch")),
            updatedUser: Update(Select(["ref"], Var("user")), {
                data: {
                    stats: {
                        stalkCount: Add(
                            Select(
                                ["data", "stats", "stalkCount"],
                                Var("user"),
                                0
                            ),
                            1
                        ),
                    },
                },
            }),
            following: GetFollowingStatusStalk(Select(["ref"], Var("user"))),
        },
        {
            name: Select(["data", "name"], Var("user")),
            username: Select(["data", "username"], Var("user")),
            about: Select(["data", "about"], Var("user")),
            picture: Select(["data", "picture"], Var("user")),
            stats: {
                followerCount: Select(
                    ["data", "stats", "followerCount"],
                    Var("user"),
                    0
                ),
                followingCount: Select(
                    ["data", "stats", "followingCount"],
                    Var("user"),
                    0
                ),
                likeCount: Select(
                    ["data", "stats", "likeCount"],
                    Var("user"),
                    0
                ),
                following: Var("following"),
            },
            joined: Select(["data", "joined"], Var("user")),
        }
    );

export const GetUserByUsername = (username) =>
    Get(Match(Index("user_by_username"), [username]));

export const GetUserRefByUsername = (username) =>
    Select(["ref"], GetUserByUsername(username));

export const GetSingleUser = (username) =>
    Let(
        {
            user: GetUserByUsername(username),
        },
        {
            name: Select(["data", "name"], Var("user")),
            username: Select(["data", "username"], Var("user")),
            about: Select(["data", "about"], Var("user")),
            picture: Select(["data", "picture"], Var("user")),
            joinedAt: Select(["data", "joinedAt"], Var("user")),
            stats: {
                followerCount: Select(
                    ["data", "stats", "followerCount"],
                    Var("user"),
                    0
                ),
                followingCount: Select(
                    ["data", "stats", "followingCount"],
                    Var("user"),
                    0
                ),
                likeCount: Select(
                    ["data", "stats", "likeCount"],
                    Var("user"),
                    0
                ),
            },
        }
    );

export function GetViewerRef() {
    return If(
        HasCurrentIdentity(),
        Select(
            ["data", 0],
            Paginate(Match(Index("user_by_connection"), CurrentIdentity()))
        ),
        null
    );
}

export function GetViewer() {
    return Get(GetViewerRef());
}

export const GetPartialUser = (userRef) =>
    Let(
        {
            user: Get(userRef),
        },
        {
            username: Select(["data", "username"], Var("user")),
            name: Select(["data", "name"], Var("user")),
            picture: Select(["data", "picture"], Var("user")),
        }
    );

export function GetSuggestedUsers(afterRef) {
    return Map(
        Paginate(
            Join(
                Join(
                    Match(Index("following_by_user"), GetViewerRef()),
                    Match(Index("following_by_user"))
                ),
                Index("users_sorted_popularity")
            ),
            {
                size: 20,
                after: afterRef != null && GetUserPopularityCursor(afterRef),
            }
        ),
        Lambda(["score", "ref"], GetPartialUser(Var("ref")))
    );
}

export function GetFollowers(username, afterRef) {
    return Map(
        Paginate(
            Join(
                Match(Index("followers_by_author"), [
                    Select(["ref"], GetUserByUsername(username)),
                    true,
                ]),
                Index("users_sorted_popularity")
            ),
            {
                size: 20,
                after: afterRef != null && GetUserPopularityCursor(afterRef),
            }
        ),
        Lambda(["created", "ref"], GetPartialUser(Var("ref")))
    );
}

export const GetTrendingUsers = (afterRef) =>
    Map(
        Paginate(
            Join(
                Match(Index("blocked_users"), [false]),
                Index("users_sorted_popularity")
            ),
            {
                size: 20,
                after: afterRef != null && GetUserPopularityCursor(afterRef),
            }
        ),
        Lambda(["score", "ref"], GetPartialUser(Var("ref")))
    );
