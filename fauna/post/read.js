/** @format */
import { query } from "faunadb";
const {
	Call,
	Create,
	Collection,
	CurrentIdentity,
	Paginate,
	Documents,
	Lambda,
	Get,
	Var,
	Select,
	Let,
	Match,
	Index,
	Join,
	If,
	Exists,
	Update,
	Do,
	Add,
	Subtract,
	Not,
	Contains,
	Abort,
	Now,
} = query;

import { GetMinimalUser, GetViewerRef } from "../user/read";
import { GetContentComments } from "../comment/read";

export function GetPost(
	postRef,
	withAuthor = true,
	comments = 3,
	withViewerStats = false
) {
	return Let(
		{
			post: Get(postRef),

			authorRef: Select(["data", "authorRef"], Var("post")),
			author: withAuthor ? GetMinimalUser(Var("authorRef")) : {},
			comments: GetContentComments(postRef, "post", comments),

			viewerRef: withViewerStats ? GetViewerRef() : null,

			viewerPostStatsMatch: withViewerStats
				? Match(
						Index("stats_by_postRef_and_userRef"),
						Var("viewerRef"),
						postRef
				  )
				: null,
			viewerPostStats: withViewerStats
				? If(
						Exists(Var("viewerPostStatsMatch")),
						Get(Var("viewerPostStatsMatch")),
						{}
				  )
				: null,

			viewerPostStats: Var("viewerPostStats"),
		},
		{
			post: Var("post"),
			author: Var("author"),
			comments: Var("comments"),
			viewerPostStats: Var("viewerPostStats"),
		}
	);
}
