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
    Call,
    Documents,
    Collection,
    Function: Fn,
} = query;

// cursors
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
                Documents(Collection("authors")),
                Index("authors_sorted_popularity")
            ),
            {
                size: 20,
                after:
                    afterRef != null &&
                    Call(Fn("getTrendingAuthorsCursor"), afterRef),
            }
        ),
        Lambda(["score", "ref"], Call(Fn("getItemAuthor"), Var("ref")))
    );
