/** @format */

import { Divide, query } from "faunadb";

import { GetPartialAuthor } from "../authors/read";

const { Paginate, Lambda, Get, Var, Select, Let, Match, Index, Join, Map } =
    query;

function GetComment(ref) {
    return Let(
        {
            comment: Get(ref),
            author: GetPartialAuthor(
                Select(["data", "author"], Var("comment"))
            ),
        },
        {
            id: ref,
            createdAt: Select(["data", "createdAt"], Var("comment")),
            updatedAt: Select(["data", "updatedAt"], Var("comment"), null),
            body: Select(["data", "body"], Var("comment")),
            author: Var("author"),
            stats: {
                likeCount: Select(
                    ["data", "stats", "likeCount"],
                    Var("comment"),
                    null
                ),
                replyCount: Select(
                    ["data", "stats", "replyCount"],
                    Var("comment"),
                    null
                ),
            },
        }
    );
}

export function GetPublicationComments(parentRef, afterRef) {
    return Map(
        Paginate(Match(Index("comments_by_parent"), [parentRef]), {
            size: 20,
            after: afterRef !== null && GetComment(afterRef),
        }),
        Lambda(["ref"], GetComment(Var("ref")))
    );
}
