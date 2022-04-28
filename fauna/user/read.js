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

export function GetUserRefByAccountConnection(accountConnection) {
	return Select(
		[0],
		Paginate(Match(Index("userRef_by_accountConnection"), accountConnection))
	);
}

export function GetViewerRef() {
	return GetUserRefByAccountConnection(CurrentIdentity());
}

export function GetViewer() {
	return Get(GetViewerRef());
}

export function GetMinimalUser(userRef) {
	return Let(
		{
			data: Select(
				["data", 0],
				Paginate(Match(Index("minimalUser_by_userRef"), userRef))
			),
		},
		{
			username: Select(0, Var("data")),
			name: Select(1, Var("data")),
			picture: Select(2, Var("data")),
		}
	);
}
