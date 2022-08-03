/** @format */
import { query } from "faunadb";

const { Var, Collection, Let, Select, Create, Now, Do } = query;

export function CreateAuthor(data) {
    return Let(
        {
            author: Create(Collection("authors"), {
                data: {
                    ...data,
                    joined_at: Now(),
                },
            }),
        },
        Do(
            Create(Collection("authorinteractions"), {
                data: {
                    author: Select(["ref"], Var("author")),
                    interactor: Select(["ref"], Var("author")),
                    follow: true,
                    created_at: Now(),
                },
            }),
            true
        )
    );
}
