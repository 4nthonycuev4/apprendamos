/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "../users/read";

const { Create, Update, Collection, Let, Var, Get, Select, Add, Now } = query;

export const CreatePublication = (body) => Let(
  {
    authorRef: GetViewerRef(),
    author: Get(Var("authorRef")),

    publication: Create(Collection("publications"), {
      data: {
        body,
        author: Var("authorRef"),
        createdAt: Now(),
        isDraft: true,
      },
    }),

    authorUpdated: Update(Var("authorRef"), {
      data: {
        publicationCount: Add(1, Select(["publicationCount"], Var("author"), 0)),
      },
    }),
  },
  { id: Select(["ref"], Var("publication")) }
);