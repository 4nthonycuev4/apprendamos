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

import { GetMinimalUser } from "../user/read";

export function GetCommentWithMinimalAuthor(commentRef) {
	return Let(
		{
			comment: Get(commentRef),

			authorRef: Select(["data", "authorRef"], Var("comment")),
			author: GetMinimalUser(Var("authorRef")),
		},
		{
			author: Var("author"),
			comment: Var("comment"),
		}
	);
}

export function GetCommentsWithMinimalAuthor(commentRefs) {
	return query.Map(
		commentRefs,
		Lambda(["ts", "ref"], GetCommentWithMinimalAuthor(Var("ref")))
	);
}

export function GetContentComments(contentRef, docType, size) {
	return GetCommentsWithMinimalAuthor(
		Paginate(
			Join(
				Match(Index(`comments_by_${docType}Ref`), contentRef),
				Index("content_sorted_ts")
			),
			{ size }
		)
	);
}
