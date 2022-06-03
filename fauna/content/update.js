/** @format */

import { query } from "faunadb";

import { GetUserRefByUsername, GetViewerRef } from "../users/read";

const {
    Create,
    Collection,
    Get,
    Var,
    Select,
    Let,
    Match,
    Index,
    If,
    Exists,
    Update,
    Add,
    Not,
    Now,
} = query;

export function Like(contentRef) {
    return Let(
        {
            viewerRef: GetViewerRef(),

            content: Get(contentRef),
            contentStats: Get(Match(
                Index("contentstats_by_user"),
                [contentRef, Var("viewerRef")]
            )),

            authorRef: Select(["data", "author"], Var("content")),
            author: Get(Var("authorRef")),
            authorStats: Get(Match(
                Index("authorstats_by_user"),
                [Var("authorRef"), Var("viewerRef")]
            )),

            like: Select(["data", "like"], Var("contentStats")),
            dislike: Select(["data", "dislike"], Var("contentStats")),

            likeGain: If(Var("like"), -1, 1),
            dislikeGain: If(Var("dislike"), -1, 0),

            contentStatsUpdated: Update(Select(["ref"], Var("contentStats")), {
                data: {
                    like: Not(Var("like")),
                    dislike: false,
                }
            }),

            contentUpdated: Update(contentRef, {
                data: {
                    stats: {
                        likeCount: Add(Select(["data", "stats", "likeCount"], Var("content")), Var("likeGain")),
                        dislikeCount: Add(Select(["data", "stats", "dislikeCount"], Var("content")), Var("dislikeGain")),
                    }
                }
            }),
            authorStatsUpdated: Update(Select(["ref"], Var("authorStats")), {
                data: {
                    likeCount: Add(Select(["data", "likeCount"], Var("authorStats")), Var("likeGain")),
                    dislikeCount: Add(Select(["data", "dislikeCount"], Var("authorStats")), Var("dislikeGain")),
                }
            }),
            authorUpdated: Update(Var("authorRef"), {
                data: {
                    stats: {
                        likeCount: Add(Select(["data", "stats", "likeCount"], Var("author")), Var("likeGain")),
                        dislikeCount: Add(Select(["data", "stats", "dislikeCount"], Var("author")), Var("dislikeGain")),
                    }
                }
            }),
        },
        {
            viewerStats: {
                like: Select(["data", "like"], Var("contentStatsUpdated"), false),
                dislike: Select(["data", "dislike"], Var("contentStatsUpdated"), false),
                save: Select(["data", "save"], Var("contentStatsUpdated"), false),
                comment: If(Select(["data", "commentCount"], Var("contentStatsUpdated"), 0) > 0, true, false),
                cheer: If(Select(["data", "cheerCount"], Var("contentStatsUpdated"), 0) > 0, true, false),
            },
            stats: {
                likeCount: Select(["data", "stats", "likeCount"], Var("contentUpdated"), 0),
                commentCount: Select(["data", "stats", "commentCount"], Var("contentUpdated"), 0),
                cheerCount: Select(["data", "stats", "cheerCount"], Var("contentUpdated"), 0),
            }
        }
    )
}

export function Dislike(contentRef) {
    return Let(
        {
            viewerRef: GetViewerRef(),

            content: Get(contentRef),
            contentStats: Get(Match(
                Index("contentstats_by_user"),
                [contentRef, Var("viewerRef")]
            )),

            authorRef: Select(["data", "author"], Var("content")),
            author: Get(Var("authorRef")),
            authorStats: Get(Match(
                Index("authorstats_by_user"),
                [Var("authorRef"), Var("viewerRef")]
            )),

            like: Select(["data", "like"], Var("contentStats")),
            dislike: Select(["data", "dislike"], Var("contentStats")),

            likeGain: If(Var("like"), -1, 0),
            dislikeGain: If(Var("dislike"), -1, 1),

            contentStatsUpdated: Update(Select(["ref"], Var("contentStats")), {
                data: {
                    like: false,
                    dislike: Not(Var("dislike")),
                }
            }),

            contentUpdated: Update(contentRef, {
                data: {
                    stats: {
                        likeCount: Add(Select(["data", "stats", "likeCount"], Var("content")), Var("likeGain")),
                        dislikeCount: Add(Select(["data", "stats", "dislikeCount"], Var("content")), Var("dislikeGain")),
                    }
                }
            }),
            authorStatsUpdated: Update(Select(["ref"], Var("authorStats")), {
                data: {
                    likeCount: Add(Select(["data", "likeCount"], Var("authorStats")), Var("likeGain")),
                    dislikeCount: Add(Select(["data", "dislikeCount"], Var("authorStats")), Var("dislikeGain")),
                }
            }),
            authorUpdated: Update(Var("authorRef"), {
                data: {
                    stats: {
                        likeCount: Add(Select(["data", "stats", "likeCount"], Var("author")), Var("likeGain")),
                        dislikeCount: Add(Select(["data", "stats", "dislikeCount"], Var("author")), Var("dislikeGain")),
                    }
                }
            }),
        },
        {
            viewerStats: {
                like: Select(["data", "like"], Var("contentStatsUpdated"), false),
                dislike: Select(["data", "dislike"], Var("contentStatsUpdated"), false),
                save: Select(["data", "save"], Var("contentStatsUpdated"), false),
                comment: If(Select(["data", "commentCount"], Var("contentStatsUpdated"), 0) > 0, true, false),
                cheer: If(Select(["data", "cheerCount"], Var("contentStatsUpdated"), 0) > 0, true, false),
            },
            stats: {
                likeCount: Select(["data", "stats", "likeCount"], Var("contentUpdated"), 0),
                commentCount: Select(["data", "stats", "commentCount"], Var("contentUpdated"), 0),
                cheerCount: Select(["data", "stats", "cheerCount"], Var("contentUpdated"), 0),
            }
        }
    )
}

export function Save(contentRef) {
    return Let(
        {
            viewerRef: GetViewerRef(),

            content: Get(contentRef),
            contentStats: Get(Match(
                Index("contentstats_by_user"),
                [contentRef, Var("viewerRef")]
            )),

            authorRef: Select(["data", "author"], Var("content")),
            author: Get(Var("authorRef")),
            authorStats: Get(Match(
                Index("authorstats_by_user"),
                [Var("authorRef"), Var("viewerRef")]
            )),

            save: Select(["data", "save"], Var("contentStats")),

            saveGain: If(Var("save"), -1, 1),

            contentStatsUpdated: Update(Select(["ref"], Var("contentStats")), {
                data: {
                    save: Not(Var("save")),
                    saved: If(Not(Var("save")), Now(), null),
                }
            }),

            contentUpdated: Update(contentRef, {
                data: {
                    stats: {
                        saveCount: Add(Select(["data", "stats", "saveCount"], Var("content")), Var("saveGain")),
                    }
                }
            }),
            authorStatsUpdated: Update(Select(["ref"], Var("authorStats")), {
                data: {
                    saveCount: Add(Select(["data", "saveCount"], Var("authorStats")), Var("saveGain")),
                }
            }),
            authorUpdated: Update(Var("authorRef"), {
                data: {
                    stats: {
                        saveCount: Add(Select(["data", "stats", "saveCount"], Var("author")), Var("saveGain")),
                    }
                }
            }),
        },
        {
            viewerStats: {
                like: Select(["data", "like"], Var("contentStatsUpdated"), false),
                dislike: Select(["data", "dislike"], Var("contentStatsUpdated"), false),
                save: Select(["data", "save"], Var("contentStatsUpdated"), false),
                comment: If(Select(["data", "commentCount"], Var("contentStatsUpdated"), 0) > 0, true, false),
                cheer: If(Select(["data", "cheerCount"], Var("contentStatsUpdated"), 0) > 0, true, false),
            },
            stats: {
                likeCount: Select(["data", "stats", "likeCount"], Var("contentUpdated"), 0),
                commentCount: Select(["data", "stats", "commentCount"], Var("contentUpdated"), 0),
                cheerCount: Select(["data", "stats", "cheerCount"], Var("contentUpdated"), 0),
            }
        }
    )
}

export function FollowUser(username) {
    return Let(
        {
            viewerRef: GetViewerRef(),
            authorRef: GetUserRefByUsername(username),
            viewerAuthorStatsRefMatch: Match(
                Index("stats_by_authorRef_and_userRef"),
                Var("authorRef"),
                Var("viewerRef")
            ),
            viewerAuthorStats: If(
                Exists(Var("viewerAuthorStatsRefMatch")),
                Get(Var("viewerAuthorStatsRefMatch")),
                null
            ),

            viewerAuthorStatsUpdated: If(
                Not(Exists(Var("viewerAuthorStatsRefMatch"))),
                Create(Collection("UserAuthorStats"), {
                    data: {
                        userRef: Var("viewerRef"),
                        authorRef: Var("authorRef"),
                        following: true,
                        likes: { memorama: 0, article: 0, question: 0, answer: 0 },
                        saved: {
                            memorama: 0,
                            article: 0,
                            question: 0,
                            answer: 0,
                        },
                        comments: {
                            memorama: 0,
                            article: 0,
                            question: 0,
                            answer: 0,
                        },
                        created: Now(),
                    },
                }),
                Update(Select(["ref"], Var("viewerAuthorStats")), {
                    data: {
                        following: Not(
                            Select(["data", "following"], Var("viewerAuthorStats"))
                        ),
                    },
                })
            ),

            newFollowingStatus: Select(
                ["data", "following"],
                Var("viewerAuthorStatsUpdated")
            ),

            author: Update(Var("authorRef"), {
                data: {
                    stats: {
                        followers: Add(
                            Select(["data", "stats", "followers"], Get(Var("authorRef"))),
                            If(Var("newFollowingStatus"), 1, -1)
                        ),
                    },
                },
            }),
            viewer: Update(Var("viewerRef"), {
                data: {
                    stats: {
                        following: Add(
                            Select(["data", "stats", "following"], Get(Var("viewerRef"))),
                            If(Var("newFollowingStatus"), 1, -1)
                        ),
                    },
                },
            }),
        },
        {
            stats: Select(["data", "stats"], Var("author")),
            viewerStats: Var("viewerAuthorStatsUpdated"),
        }
    );
}
