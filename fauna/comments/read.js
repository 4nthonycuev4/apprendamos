/** @format */

import { Divide, query } from "faunadb";

import { GetPartialUser } from "../users/read";

const {
    Call,
    Create,
    Collection,
    CurrentIdentity,
    Paginate,
    Documents,
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
    Update,
    Do,
    Add,
    Subtract,
    Not,
    Contains,
    Abort,
    Now,
    Map,
} = query;

function GetComment(ref) {
    return Let(
        {
            comment: Get(ref),
            author: GetPartialUser(Select(["data", "author"], Var("comment"))),
        },
        {
            id: ref,
            created: Select(["data", "created"], Var("comment")),
            updated: Select(["data", "updated"], Var("comment"), false),
            message: Select(["data", "message"], Var("comment")),
            author: Var("author"),
            stats: {
                likeCount: Select(
                    ["data", "stats", "likeCount"],
                    Var("comment")
                ),
                commentCount: Select(
                    ["data", "stats", "commentCount"],
                    Var("comment")
                ),
            },
        }
    );
}

export function GetPublicationComments(parentRef, afterRef) {
    return Map(
        Paginate(
            Join(
                Match(Index("comments_by_parent"), parentRef),
                Index("comments_sorted_popularity")
            ),
            {
                size: 20,
                after: afterRef !== null && GetComment(afterRef),
            }
        ),
        Lambda(["score", "ref"], GetComment(Var("ref")))
    );
}
