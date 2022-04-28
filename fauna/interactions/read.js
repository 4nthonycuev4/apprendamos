/** @format */

import { Match, Get, Index } from "faunadb";

import { GetViewerRef } from "../user/read";

export function GetViewerContentStats(contentRef, docType) {
	return Get(
		Match(
			Index(`stats_by_${docType}Ref_and_userRef`),
			contentRef,
			GetViewerRef()
		)
	);
}
