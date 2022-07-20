import { query } from "faunadb";
const { Let, Select, Index, Get, If, Var, Exists, Match } = query;

import { GetViewerRef, GetUserRefByUsername } from "../../users/read";

const GetAuthorInteractions = (username) =>
    Let(
        {
            interactionsMatch: Match(Index("author_interactions"), [
                GetUserRefByUsername(username),
                GetViewerRef(),
            ]),
        },
        If(
            Exists(Var("interactionsMatch")),
            Let(
                {
                    interactions: Get(Var("interactionsMatch")),
                },
                {
                    follow: Select(
                        ["data", "follow"],
                        Var("interactions"),
                        null
                    ),
                }
            ),
            {}
        )
    );

export default GetAuthorInteractions;
