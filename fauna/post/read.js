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

export function GetPostWithMinimalAuthorAndComments(postRef) {
	return Let(
		{
			post: Get(postRef),

			authorRef: Select(["data", "authorRef"], Var("post")),
			author: GetMinimalUser(Var("authorRef")),
			comments: GetContentComments(postRef, "post"),
		},
		{
			author: Var("author"),
			post: Var("post"),
			comments: Var("comments"),
		}
	);
}

export function GetPostWithMinimalAuthorAndViewerStats(postRef) {
	return Let(
		{
			post: Get(postRef),

			authorRef: Select(["data", "authorRef"], Var("post")),
			author: this.GetMinimalUser(Var("authorRef")),

			viewerRef: GetViewerRef(),

			viewerPostStatsMatch: Match(
				Index("stats_by_postRef_and_userRef"),
				Var("viewerRef"),
				postRef
			),
			viewerPostStats: If(
				Exists(Var("viewerPostStatsMatch")),
				Get(Var("viewerPostStatsMatch")),
				{}
			),
		},
		{
			author: Var("author"),
			post: Var("post"),
			viewerPostStats: Var("viewerPostStats"),
		}
	);
}

export function GetPostsWithMinimalAuthorAndViewerStats(postRefs) {
	return Let(
		{
			posts: Map(
				(postRef) => GetPostWithMinimalAuthorAndViewerStats(postRef),
				postRefs
			),
		},
		{
			posts: Var("posts"),
		}
	);
}
