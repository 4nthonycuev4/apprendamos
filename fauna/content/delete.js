/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "../user/read";

const { Delete, Ref, Collection, Let, Update, Add, Exists, Select, Var, If, Equals, Abort, Get } = query;

export function DeleteContent(ref) {
  return Let(
    {
      contentRef: Ref(Collection(ref.collection), ref.id),
      content: Delete(Var("contentRef")),

      authorRef: Select(["data", "author"], Var("content")),
      viewerRef: GetViewerRef(),
      status: If(Equals(Var("authorRef"), Var("viewerRef")), "done", Abort("It is forbidden to delete other user's content.")),

      author: Update(
        Var("authorRef"),
        {
          data: {
            stats: {
              [ref.collection]: Add(Select(["data", "stats", ref.collection], Get(Var("authorRef"))), -1),
            }
          }
        },
      )

    },
    {
      status: Var("status"),
    }
  )
}
