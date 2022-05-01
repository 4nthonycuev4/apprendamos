/** @format */

import { query } from "faunadb";

const { Let, Select, Index, Get, If, Var, Exists, Match } = query;

import { GetUserRefByUsername, GetMinimalUser } from "../user/read";
import { GetContentComments } from "../comment/read";

export function GetContentWithAuthor(
	contentRef,
	docType,
	comments,
	viewerUsername = null
) {
	return Let(
		{
			content: Get(contentRef),

			authorRef: Select(["data", "authorRef"], Var("content")),
			author: GetMinimalUser(Var("authorRef")),

			comments: GetContentComments(contentRef, docType, comments),

			viewerRef: viewerUsername ? GetUserRefByUsername(viewerUsername) : null,

			viewerContentStatsMatch: viewerUsername
				? Match(
						Index(`stats_by_${docType}Ref_and_userRef`),
						contentRef,
						Var("viewerRef")
				  )
				: null,

			viewerStats: viewerUsername
				? If(
						Exists(Var("viewerContentStatsMatch")),
						Get(Var("viewerContentStatsMatch")),
						{ ref: "not_found" }
				  )
				: null,
		},
		{
			content: Var("content"),
			author: Var("author"),
			comments: Var("comments"),
			viewerRef: Var("viewerRef"),
			viewerStats: Var("viewerStats"),
		}
	);
}
