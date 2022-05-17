/** @format */

import { query } from "faunadb";

import { GetViewerRef } from "./read";

const { Update } = query;

export function UpdateViewer(data) {
  return Update(GetViewerRef(), {
    data,
  });
}
