/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "../user/read";

const { Delete, Ref, Collection, Let, Update, Add, Get, Select, Var } = query;

export function DeleteContent(ref) {
  return Let(
    {
      authorRef: GetViewerRef(),
      content: Delete(Ref(Collection(ref.collection), ref.id)),
      author: Update(Var("authorRef"), {
        data: {
          stats: {
            [`${ref.collection.toLowerCase()}`]: Add(
              Select(
                ["data", "stats", `${ref.collection.toLowerCase()}`],
                Get(Var("authorRef"))
              ),
              -1
            ),
          },
        },
      }),
    },
    { deleted: true }
  );
}
