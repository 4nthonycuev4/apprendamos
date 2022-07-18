import { query } from "faunadb";

import { GetPartialUser, GetUserByUsername, GetUserRefByUsername, GetViewer, GetViewerRef } from "../users/read";

const { Let, Select, Index, Get, If, Var, Exists, Match, Paginate, Map, Multiply, TimeDiff, Add, Join, Collection, Time, Lambda, Update, Now, Create, SubString, Take, Count, Documents } = query;

export const GetPublicationInteractions = (ref) => Let(
    {
        interactionsMatch: Match(Index("publication_interactions"), [ref, GetViewerRef()]),
    },
    If(Exists(Var("interactionsMatch")), Let(
        {
            interactions: Get(Var("interactionsMatch"))
        },
        {
            like: Select(["data", "like"], Var("interactions"), null),
            dislike: Select(["data", "dislike"], Var("interactions"), null),
            save: Select(["data", "save"], Var("interactions"), null),
            comment: If(Select(["data", "commentCount"], Var("interactions"), 0) > 0, true, null),
            cheer: If(Select(["data", "cheerCount"], Var("interactions"), 0) > 0, true, null),
        }
    ), {})
)

