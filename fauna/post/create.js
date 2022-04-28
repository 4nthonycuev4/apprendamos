/** @format */

import { query } from "faunadb";

const { Get, Var, Collection, Let, Select, Create, Now, Update, Do, Add } =
	query;

import { GetViewerRef } from "../user/read";

export function CreatePost(body, tags) {
	return Let(
		{
			authorRef: GetViewerRef(),
			author: Get(Var("viewerRef")),

			post: Create(Collection("Posts"), {
				data: {
					body,
					tags,
					authorRef: Var("authorRef"),
					created: Now(),
					stats: {
						likes: 0,
						saved: 0,
						comments: 0,
					},
				},
			}),
		},
		Do(
			Update(Var("authorRef"), {
				data: {
					stats: {
						posts: Add(Select(["data", "stats", "posts"], Var("author")), 1),
					},
				},
			}),
			Select(["ref"], Var("post"))
		)
	);
}
