/** @format */
import { query } from "faunadb";

const { CurrentIdentity, Var, Collection, Let, Select, Create, Now } = query;

export function CreateAuthor(data) {
    return Let(
        {
            author: Create(Collection("authors"), {
                data: {
                    ...data,
                    joinedAt: Now(),
                    blocked: false,
                },
            }),
            rel: Create(Collection("authorinteractions"), {
                data: {
                    author: Select(["ref"], Var("author")),
                    author: Select(["ref"], Var("author")),
                    follow: true,
                },
            }),
            account: Create(Collection("accounts"), {
                data: {
                    connection: CurrentIdentity(),
                    author: Select(["ref"], Var("author")),
                    createdAt: Now(),
                },
            }),
        },
        true
    );
}
