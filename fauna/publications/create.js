/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "../authors/read";

const {
    Create,
    Update,
    Collection,
    Let,
    Var,
    Get,
    Select,
    Add,
    Now,
    Call,
    Function,
} = query;

export const CreatePublication = (draftRef, tags) =>
    Let(
        {
            draft: Get(Var("draft_ref")),
            publication: Create(Collection("publications"), {
                data: {
                    body: Select(["data", "body"], Var("draft")),
                    author: Select(["data", "author"], Var("draft")),
                    createdAt: Now(),
                },
            }),

            authorUpdated: Update(Var("authorRef"), {
                data: {
                    stats: {
                        publicationCount: Add(
                            1,
                            Select(["publicationCount"], Var("author"), 0)
                        ),
                    },
                },
            }),
        },
        true
    );
