import { query } from "faunadb";
const {
    Index,
    Var,
    Match,
    Paginate,
    Map,
    Lambda,
    Join,
    Select,
    Get,
    Call,
    Function: Fn,
} = query;

const GetHomePublicationsAfterCursor = (ref) => [
    Select(["data", "created_at"], Get(ref)),
    ref,
];

const GetHomePublications = (afterRef) =>
    Map(
        Paginate(
            Join(
                Join(
                    Match(
                        Index("author_following"),
                        Call(Fn("getViewerRef")),
                        true
                    ),
                    Index("publications_by_author")
                ),
                Index("publications_sorted_by_creation_time")
            ),
            {
                size: 5,
                after:
                    afterRef != null &&
                    GetHomePublicationsAfterCursor(afterRef),
            }
        ),
        Lambda(
            ["created_at", "ref"],
            Call(Fn("getItemPublication"), Var("ref"), true)
        )
    );

export default GetHomePublications;
