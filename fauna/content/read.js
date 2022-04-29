/** @format */

import { query } from "faunadb";

const { Let, Select, Index, Get, If, Var, Exists } = query;

import { GetViewerRef, GetMinimalUser } from "../user/read";
import { GetContentComments } from "../comment/read";

export function GetContentWithAuthor(
	contentRef,
	docType,
	comments = 3,
	withViewerStats = false
) {
	return Let(
		{
			content: Get(contentRef),

			authorRef: Select(["data", "authorRef"], Var("content")),
			author: GetMinimalUser(Var("authorRef")),

			comments: GetContentComments(contentRef, docType, comments),

			viewerRef: withViewerStats ? GetViewerRef() : null,

			viewerContentStatsMatch: withViewerStats
				? Match(
						Index(`stats_by_${docType}Ref_and_userRef`),
						Var("viewerRef"),
						contentRef
				  )
				: null,

			viewerStats: withViewerStats
				? If(
						Exists(Var("viewerContentStatsMatch")),
						Get(Var("viewerContentStatsMatch")),
						{}
				  )
				: null,
		},
		{
			content: Var("content"),
			author: Var("author"),
			comments: Var("comments"),
			viewerStats: Var("viewerStats"),
		}
	);
}
