/** @format */
import { query } from "faunadb";

const { CurrentIdentity, Var, Collection, Let, Select, Create, Now } = query;

export function CreateUser(data) {
    return Let(
        {
            user: Create(Collection("users"), {
                data: {
                    ...data,
                    joinedAt: Now(),
                    blocked: false,
                },
            }),
            rel: Create(Collection("authorinteractions"), {
                data: {
                    user: Select(["ref"], Var("user")),
                    author: Select(["ref"], Var("user")),
                    follow: true,
                },
            }),
            account: Create(Collection("accounts"), {
                data: {
                    connection: CurrentIdentity(),
                    user: Select(["ref"], Var("user")),
                    createdAt: Now(),
                },
            }),
        },
        true
    );
}
