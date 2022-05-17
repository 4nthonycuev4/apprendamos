/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "../user/read";

const { Create, Update, Collection, Let, Var, Get, Select, Add, Now } = query;

function ParseCollection(x) {
  return x === "flashquiz"
    ? "Flashquizzes"
    : `${x[0].toUpperCase() + x.slice(1)}s`;
}

export function CreateContent(data, docType) {
  return Let(
    {
      authorRef: GetViewerRef(),
      content: Create(Collection(ParseCollection(docType)), {
        data: {
          ...data,
          authorRef: Var("authorRef"),
          created: Now(),
          stats: {
            likes: 0,
            comments: 0,
            saved: 0,
          },
        },
      }),
      author: Update(Var("authorRef"), {
        data: {
          stats: {
            [ParseCollection(docType).toLowerCase()]: Add(
              1,
              Select(
                ["data", "stats", ParseCollection(docType).toLowerCase()],
                Get(Var("authorRef"))
              )
            ),
          },
        },
      }),
    },
    {
      content: { ref: Select(["ref"], Var("content")) },
      author: { username: Select(["data", "username"], Var("author")) },
    }
  );
}
