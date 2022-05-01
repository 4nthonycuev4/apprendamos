/** @format */

import { Match, Get, Index } from "faunadb";

import { GetViewerRef, GetUserRefByUsername } from "../user/read";

export function GetViewerContentStats(contentRef, docType) {
	return Get(
		Match(
			Index(`stats_by_${docType}Ref_and_userRef`),
			contentRef,
			GetViewerRef()
		)
	);
}

export function GetViewerAuthorStats(username) {
	return Get(
		Match(
			Index(`stats_by_authorRef_and_userRef`),
			GetUserRefByUsername(username),
			GetViewerRef()
		)
	);
}
