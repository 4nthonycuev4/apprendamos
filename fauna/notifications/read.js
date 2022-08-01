import { query } from "faunadb";
const { Let, Select, Index, Get, Var, Paginate, Match, Lambda, Multiply, Map } =
    query;

import { GetViewerRef, GetPartialAuthor } from "../authors/read";

const GetNotifications = (afterRef) =>
    Map(
        Paginate(Match(Index("author_notifications"), [GetViewerRef()]), {
            size: 10,
            after: afterRef != null && afterRef,
        }),
        Lambda(
            ["ref"],
            Let(
                {
                    notification: Get(Var("ref")),
                },
                {
                    id: Select(["ref"], Var("notification")),
                    statusId: Select(
                        ["data", "status"],
                        Var("notification"),
                        null
                    ),
                    statusCollection: Select(
                        ["data", "status", "collection", "id"],
                        Var("notification"),
                        null
                    ),
                    type: Select(["data", "type"], Var("notification")),
                    body: Select(["data", "body"], Var("notification"), null),
                    ts: Multiply(Select(["ts"], Var("notification")), 0.001),
                    author: GetPartialAuthor(
                        Select(["data", "author"], Var("notification"))
                    ),
                }
            )
        )
    );

export default GetNotifications;
