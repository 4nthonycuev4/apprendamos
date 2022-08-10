import { query } from "faunadb";
const {
    Call,
    Function: Fn,
    Let,
    Select,
    Index,
    Get,
    Var,
    Paginate,
    Match,
    Lambda,
    Multiply,
    Map,
} = query;

const GetNotifications = (afterRef) =>
    Map(
        Paginate(
            Match(Index("author_notifications"), Call(Fn("getViewerRef"))),
            {
                size: 10,
                after: afterRef != null && afterRef,
            }
        ),
        Lambda(
            ["ref"],
            Let(
                {
                    notification: Get(Var("ref")),
                },
                {
                    id: Select(["ref", "id"], Var("notification")),
                    statusFref: Select(
                        ["data", "status"],
                        Var("notification"),
                        null
                    ),
                    alert: Select(["data", "alert"], Var("notification")),
                    body: Select(["data", "body"], Var("notification"), null),
                    ts: Multiply(Select(["ts"], Var("notification")), 0.001),
                    interactor: Call(
                        Fn("getItemAuthor"),
                        Select(["data", "interactor"], Var("notification"))
                    ),
                }
            )
        )
    );

export default GetNotifications;
