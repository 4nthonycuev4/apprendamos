import { query } from "faunadb";
const {
    Let,
    Select,
    Index,
    Get,
    Var,
    Paginate,
    Match,
    Lambda,
    Call,
    Function: Fn,
    Map,
} = query;

const GetSavedPublicationsAfterCursor = (ref) =>
    Let(
        {
            interactions: Get(ref),
        },
        [
            Select(["data", "saved_at"], Var("interactions")),
            Select(["data", "publication"], Var("interactions")),
            ref,
        ]
    );

const GetSavedPublications = (afterRef) =>
    Let(
        { viewer_ref: Call(Fn("getViewerRef")) },
        Map(
            Paginate(
                Match(
                    Index("saved_publications_by_interactor"),
                    Var("viewer_ref"),
                    true
                ),
                {
                    size: 5,
                    after:
                        afterRef != null &&
                        GetSavedPublicationsAfterCursor(
                            afterRef,
                            Var("viewer_ref")
                        ),
                }
            ),
            Lambda(
                ["saved_at", "publication_ref"],
                Let(
                    {
                        publication: Call(
                            Fn("getItemPublication"),
                            Var("publication_ref"),
                            true
                        ),
                    },
                    {
                        saved_at: Var("saved_at"),
                        data: Var("publication"),
                    }
                )
            )
        )
    );

export default GetSavedPublications;
