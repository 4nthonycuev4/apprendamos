import { query } from "faunadb";
const { Let, Select, Index, Get, If, Var, Exists, Match } = query;

import { GetViewerRef, GetAuthorRefBynickname } from "../../authors/read";

const GetAuthorInteractions = (nickname) =>
    Let(
        {
            interactionsMatch: Match(Index("author_interactions"), [
                GetAuthorRefBynickname(nickname),
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
