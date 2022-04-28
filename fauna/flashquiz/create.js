/** @format */

import { query } from "faunadb";

const { Get, Var, Collection, Let, Select, Create, Now, Update, Do, Add } =
	query;

import { GetViewerRef } from "../user/read";

export function CreateFlashquiz(name, tags, flashcards) {
	return Let(
		{
			authorRef: GetViewerRef(),
			author: Get(Var("viewerRef")),

			flashquiz: Create(Collection("Flashquizzes"), {
				data: {
					name,
					tags,
					flashcards,
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
						flashquizzes: Add(
							Select(["data", "stats", "flashquizzes"], Var("author")),
							1
						),
					},
				},
			}),
			Select(["ref"], Var("flashquiz"))
		)
	);
}
