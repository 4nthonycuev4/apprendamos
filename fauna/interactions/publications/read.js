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

const GetPublicationInteractions = (ref) =>
    Let(
        {
            interactions_match: Match(
                Index("single_publication_interactions"),
                [ref, Call(Fn("getViewerRef"))]
            ),
        },
        If(
            Exists(Var("interactions_match")),
            Let(
                {
                    interactions: Get(Var("interactions_match")),
                },
                {
                    like: Select(["data", "like"], Var("interactions"), null),
                    dislike: Select(
                        ["data", "dislike"],
                        Var("interactions"),
                        null
                    ),
                    save: Select(["data", "save"], Var("interactions"), null),
                    comment: If(
                        Select(
                            ["data", "comment_count"],
                            Var("interactions"),
                            0
                        ) > 0,
                        true,
                        null
                    ),
                    cheer: If(
                        Select(
                            ["data", "cheer_count"],
                            Var("interactions"),
                            0
                        ) > 0,
                        true,
                        null
                    ),
                }
            ),
            {}
        )
    );

export default GetPublicationInteractions;
