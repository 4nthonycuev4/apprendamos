/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "../users/read";

const {
    Delete,
    Ref,
    Collection,
    Let,
    Update,
    Add,
    Exists,
    Select,
    Var,
    If,
    Equals,
    Abort,
    Get,
} = query;

export function DeletePublication(ref) {
    return Let(
        {
            publicationRef: Ref(Collection(ref.collection), ref.id),
            publication: Delete(Var("publicationRef")),

            authorRef: Select(["data", "author"], Var("publication")),
            viewerRef: GetViewerRef(),
            status: If(
                Equals(Var("authorRef"), Var("viewerRef")),
                "done",
                Abort("It is forbidden to delete other user's publication.")
            ),

            author: Update(Var("authorRef"), {
                data: {
                    stats: {
                        publicationCount: {
                            [ref.collection]: Add(
                                Select(
                                    [
                                        "data",
                                        "stats",
                                        "publicationCount",
                                        ref.collection,
                                    ],
                                    Get(Var("authorRef"))
                                ),
                                -1
                            ),
                        },
                    },
                },
            }),
        },
        {
            status: Var("status"),
        }
    );
}
