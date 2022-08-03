import { query } from "faunadb";
const {
    Let,
    Select,
    Index,
    Get,
    If,
    Var,
    Exists,
    Match,
    Call,
    Function: Fn,
} = query;

const GetAuthorInteractions = (nickname) =>
    Let(
        {
            interactions_match: Match(Index("single_author_interactions"), [
                Call(Fn("getAuthorRefByNickname"), nickname),
                Call(Fn("getViewerRef")),
            ]),
        },
        If(
            Exists(Var("interactions_match")),
            Let(
                {
                    interactions: Get(Var("interactions_match")),
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
