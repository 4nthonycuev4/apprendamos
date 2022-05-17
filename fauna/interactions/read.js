/** @format */

import { Get, Index, Match, Paginate, Select } from "faunadb";

import { GetUserRefByUsername, GetViewerRef } from "../user/read";

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

export function GetFollowingStatus(username) {
  return Select(
    ["data", 0],
    Paginate(
      Match(
        Index("followingStatus"),
        GetUserRefByUsername(username),
        GetViewerRef()
      )
    )
  );
}
