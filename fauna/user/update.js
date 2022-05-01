/** @format */

import { GetViewerRef } from "./read";

import { query } from "faunadb";

const { Update } = query;

export function UpdateViewer(data) {
	return Update(GetViewerRef(), {
		data: data,
	});
}
