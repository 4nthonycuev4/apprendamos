import { query } from "faunadb";

import { GetViewerRef, GetPartialUser } from "../users/read";

const { Let, Select, Index, Get, Var, Paginate, Match, Lambda, Multiply, Map } = query;

export const GetNotifications = (afterRef) => Map(
    Paginate(
        Match(Index("author_notifications"), [GetViewerRef()]),
        { size: 10, after: afterRef != null && afterRef }
    ),
    Lambda(
        ["ref"],
        Let(
            {
                notification: Get(Var("ref")),
            },
            {
                id: Select(["ref"], Var("notification")),
                statusId: Select(["data", "status"], Var("notification")),
                statusCollection: Select(["data", "status", "collection", "id"], Var("notification")),
                type: Select(["data", "type"], Var("notification")),
                body: Select(["data", "body"], Var("notification")),
                ts: Multiply(Select(["ts"], Var("notification")), 0.001),
                user: GetPartialUser(Select(["data", "user"], Var("notification"))),
            }
        )
    )
)