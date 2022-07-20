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

export function Like(publicationRef) {
    return Let(
        {
            viewerRef: GetViewerRef(),

            publication: Get(publicationRef),
            publicationStats: Get(
                Match(Index("publicationstats_by_user"), [
                    publicationRef,
                    Var("viewerRef"),
                ])
            ),

            authorRef: Select(["data", "author"], Var("publication")),
            author: Get(Var("authorRef")),
            authorStats: Get(
                Match(Index("authorstats_by_user"), [
                    Var("authorRef"),
                    Var("viewerRef"),
                ])
            ),

            like: Select(["data", "like"], Var("publicationStats")),
            dislike: Select(["data", "dislike"], Var("publicationStats")),

            likeGain: If(Var("like"), -1, 1),
            dislikeGain: If(Var("dislike"), -1, 0),

            publicationStatsUpdated: Update(
                Select(["ref"], Var("publicationStats")),
                {
                    data: {
                        like: Not(Var("like")),
                        dislike: false,
                    },
                }
            ),

            publicationUpdated: Update(publicationRef, {
                data: {
                    stats: {
                        likeCount: Add(
                            Select(
                                ["data", "stats", "likeCount"],
                                Var("publication")
                            ),
                            Var("likeGain")
                        ),
                        dislikeCount: Add(
                            Select(
                                ["data", "stats", "dislikeCount"],
                                Var("publication")
                            ),
                            Var("dislikeGain")
                        ),
                    },
                },
            }),
            authorStatsUpdated: Update(Select(["ref"], Var("authorStats")), {
                data: {
                    likeCount: Add(
                        Select(["data", "likeCount"], Var("authorStats")),
                        Var("likeGain")
                    ),
                    dislikeCount: Add(
                        Select(["data", "dislikeCount"], Var("authorStats")),
                        Var("dislikeGain")
                    ),
                },
            }),
            authorUpdated: Update(Var("authorRef"), {
                data: {
                    stats: {
                        likeCount: Add(
                            Select(
                                ["data", "stats", "likeCount"],
                                Var("author")
                            ),
                            Var("likeGain")
                        ),
                        dislikeCount: Add(
                            Select(
                                ["data", "stats", "dislikeCount"],
                                Var("author")
                            ),
                            Var("dislikeGain")
                        ),
                    },
                },
            }),
        },
        {
            viewerStats: {
                like: Select(
                    ["data", "like"],
                    Var("publicationStatsUpdated"),
                    false
                ),
                dislike: Select(
                    ["data", "dislike"],
                    Var("publicationStatsUpdated"),
                    false
                ),
                save: Select(
                    ["data", "save"],
                    Var("publicationStatsUpdated"),
                    false
                ),
                comment: If(
                    Select(
                        ["data", "commentCount"],
                        Var("publicationStatsUpdated"),
                        0
                    ) > 0,
                    true,
                    false
                ),
                cheer: If(
                    Select(
                        ["data", "cheerCount"],
                        Var("publicationStatsUpdated"),
                        0
                    ) > 0,
                    true,
                    false
                ),
            },
            stats: {
                likeCount: Select(
                    ["data", "stats", "likeCount"],
                    Var("publicationUpdated"),
                    0
                ),
                commentCount: Select(
                    ["data", "stats", "commentCount"],
                    Var("publicationUpdated"),
                    0
                ),
                cheerCount: Select(
                    ["data", "stats", "cheerCount"],
                    Var("publicationUpdated"),
                    0
                ),
            },
        }
    );
}

export function Dislike(publicationRef) {
    return Let(
        {
            viewerRef: GetViewerRef(),

            publication: Get(publicationRef),
            publicationStats: Get(
                Match(Index("publicationstats_by_user"), [
                    publicationRef,
                    Var("viewerRef"),
                ])
            ),

            authorRef: Select(["data", "author"], Var("publication")),
            author: Get(Var("authorRef")),
            authorStats: Get(
                Match(Index("authorstats_by_user"), [
                    Var("authorRef"),
                    Var("viewerRef"),
                ])
            ),

            like: Select(["data", "like"], Var("publicationStats")),
            dislike: Select(["data", "dislike"], Var("publicationStats")),

            likeGain: If(Var("like"), -1, 0),
            dislikeGain: If(Var("dislike"), -1, 1),

            publicationStatsUpdated: Update(
                Select(["ref"], Var("publicationStats")),
                {
                    data: {
                        like: false,
                        dislike: Not(Var("dislike")),
                    },
                }
            ),

            publicationUpdated: Update(publicationRef, {
                data: {
                    stats: {
                        likeCount: Add(
                            Select(
                                ["data", "stats", "likeCount"],
                                Var("publication")
                            ),
                            Var("likeGain")
                        ),
                        dislikeCount: Add(
                            Select(
                                ["data", "stats", "dislikeCount"],
                                Var("publication")
                            ),
                            Var("dislikeGain")
                        ),
                    },
                },
            }),
            authorStatsUpdated: Update(Select(["ref"], Var("authorStats")), {
                data: {
                    likeCount: Add(
                        Select(["data", "likeCount"], Var("authorStats")),
                        Var("likeGain")
                    ),
                    dislikeCount: Add(
                        Select(["data", "dislikeCount"], Var("authorStats")),
                        Var("dislikeGain")
                    ),
                },
            }),
            authorUpdated: Update(Var("authorRef"), {
                data: {
                    stats: {
                        likeCount: Add(
                            Select(
                                ["data", "stats", "likeCount"],
                                Var("author")
                            ),
                            Var("likeGain")
                        ),
                        dislikeCount: Add(
                            Select(
                                ["data", "stats", "dislikeCount"],
                                Var("author")
                            ),
                            Var("dislikeGain")
                        ),
                    },
                },
            }),
        },
        {
            viewerStats: {
                like: Select(
                    ["data", "like"],
                    Var("publicationStatsUpdated"),
                    false
                ),
                dislike: Select(
                    ["data", "dislike"],
                    Var("publicationStatsUpdated"),
                    false
                ),
                save: Select(
                    ["data", "save"],
                    Var("publicationStatsUpdated"),
                    false
                ),
                comment: If(
                    Select(
                        ["data", "commentCount"],
                        Var("publicationStatsUpdated"),
                        0
                    ) > 0,
                    true,
                    false
                ),
                cheer: If(
                    Select(
                        ["data", "cheerCount"],
                        Var("publicationStatsUpdated"),
                        0
                    ) > 0,
                    true,
                    false
                ),
            },
            stats: {
                likeCount: Select(
                    ["data", "stats", "likeCount"],
                    Var("publicationUpdated"),
                    0
                ),
                commentCount: Select(
                    ["data", "stats", "commentCount"],
                    Var("publicationUpdated"),
                    0
                ),
                cheerCount: Select(
                    ["data", "stats", "cheerCount"],
                    Var("publicationUpdated"),
                    0
                ),
            },
        }
    );
}

export function Save(publicationRef) {
    return Let(
        {
            viewerRef: GetViewerRef(),

            publication: Get(publicationRef),
            publicationStats: Get(
                Match(Index("publicationstats_by_user"), [
                    publicationRef,
                    Var("viewerRef"),
                ])
            ),

            authorRef: Select(["data", "author"], Var("publication")),
            author: Get(Var("authorRef")),
            authorStats: Get(
                Match(Index("authorstats_by_user"), [
                    Var("authorRef"),
                    Var("viewerRef"),
                ])
            ),

            save: Select(["data", "save"], Var("publicationStats")),

            saveGain: If(Var("save"), -1, 1),

            publicationStatsUpdated: Update(
                Select(["ref"], Var("publicationStats")),
                {
                    data: {
                        save: Not(Var("save")),
                        saved: If(Not(Var("save")), Now(), null),
                    },
                }
            ),

            publicationUpdated: Update(publicationRef, {
                data: {
                    stats: {
                        saveCount: Add(
                            Select(
                                ["data", "stats", "saveCount"],
                                Var("publication")
                            ),
                            Var("saveGain")
                        ),
                    },
                },
            }),
            authorStatsUpdated: Update(Select(["ref"], Var("authorStats")), {
                data: {
                    saveCount: Add(
                        Select(["data", "saveCount"], Var("authorStats")),
                        Var("saveGain")
                    ),
                },
            }),
            authorUpdated: Update(Var("authorRef"), {
                data: {
                    stats: {
                        saveCount: Add(
                            Select(
                                ["data", "stats", "saveCount"],
                                Var("author")
                            ),
                            Var("saveGain")
                        ),
                    },
                },
            }),
        },
        {
            viewerStats: {
                like: Select(
                    ["data", "like"],
                    Var("publicationStatsUpdated"),
                    false
                ),
                dislike: Select(
                    ["data", "dislike"],
                    Var("publicationStatsUpdated"),
                    false
                ),
                save: Select(
                    ["data", "save"],
                    Var("publicationStatsUpdated"),
                    false
                ),
                comment: If(
                    Select(
                        ["data", "commentCount"],
                        Var("publicationStatsUpdated"),
                        0
                    ) > 0,
                    true,
                    false
                ),
                cheer: If(
                    Select(
                        ["data", "cheerCount"],
                        Var("publicationStatsUpdated"),
                        0
                    ) > 0,
                    true,
                    false
                ),
            },
            stats: {
                likeCount: Select(
                    ["data", "stats", "likeCount"],
                    Var("publicationUpdated"),
                    0
                ),
                commentCount: Select(
                    ["data", "stats", "commentCount"],
                    Var("publicationUpdated"),
                    0
                ),
                cheerCount: Select(
                    ["data", "stats", "cheerCount"],
                    Var("publicationUpdated"),
                    0
                ),
            },
        }
    );
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
                        likes: {
                            memorama: 0,
                            article: 0,
                            question: 0,
                            answer: 0,
                        },
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
                            Select(
                                ["data", "following"],
                                Var("viewerAuthorStats")
                            )
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
                            Select(
                                ["data", "stats", "followers"],
                                Get(Var("authorRef"))
                            ),
                            If(Var("newFollowingStatus"), 1, -1)
                        ),
                    },
                },
            }),
            viewer: Update(Var("viewerRef"), {
                data: {
                    stats: {
                        following: Add(
                            Select(
                                ["data", "stats", "following"],
                                Get(Var("viewerRef"))
                            ),
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

export const View = (publicationRef) =>
    Let(
        {
            viewerRef: GetViewerRef(),
            publication: Get(publicationRef),
            publicationUpdated: Update(publicationRef, {
                data: {
                    stats: {
                        viewCount: Add(
                            Select(
                                ["data", "stats", "viewCount"],
                                Var("publication"),
                                0
                            ),
                            1
                        ),
                    },
                },
            }),

            publicationStatsMatch: Match(Index("publicationstats_by_user"), [
                publicationRef,
                Var("viewerRef"),
            ]),

            publicationStats:
                Var("viewerRef") &&
                If(
                    Exists(Var("publicationStatsMatch")),
                    Let(
                        {
                            originalPublicationStats: Get(
                                Var("publicationStatsMatch")
                            ),
                        },
                        Update(Select(["ref"], Var("publicationStats")), {
                            data: {
                                viewCount: Add(
                                    Select(
                                        ["data", "viewCount"],
                                        Var("originalPublicationStats"),
                                        0
                                    ),
                                    1
                                ),
                            },
                        })
                    ),
                    Create(Collection("PublicationStats"), {
                        data: {
                            publication: publicationRef,
                            user: Var("viewerRef"),
                            viewCount: 1,
                        },
                    })
                ),
        },
        true
    );
