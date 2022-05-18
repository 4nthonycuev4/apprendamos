/** @format */

import { Var, Exists, Get, If, Index, Let, Match, Paginate, Select } from "faunadb";

import { GetUserRefByUsername, GetViewerRef } from "../user/read";

export function GetViewerContentStats(contentRef, docType) {
  return Let(
    {
      match: Match(
        Index(`stats_by_${docType}Ref_and_userRef`),
        contentRef,
        GetViewerRef()
      ),
      stats: If(
        Exists(Var("match")),
        Get(Var("match")),
        null
      )
    },
    Var("stats")
  );
}

export function GetViewerAuthorStats(username) {
  return Let(
    {
      match: Match(
        Index(`stats_by_authorRef_and_userRef`),
        GetUserRefByUsername(username),
        GetViewerRef()
      ),
      stats: If(
        Exists(Var("match")),
        Get(Var("match")),
        null
      )
    },
    Var("stats")
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
