import { query } from "faunadb";
const {
    Index,
    Var,
    Paginate,
    Map,
    Join,
    Match,
    Lambda,
    Call,
    Now,
    Divide,
    Add,
    ToSeconds,
    Function: Fn,
} = query;

const GetTrendingPublications = (afterRef) =>
    Map(
        Paginate(
            Join(
                Match(
                    Index("publications_by_week"),
                    Divide(
                        Add(ToSeconds(Now()), -3 * 24 * 60 * 60),
                        7 * 24 * 60 * 60
                    )
                ),
                Index("publications_sorted_by_popularity_score")
            ),
            {
                size: 5,
                after:
                    afterRef != null &&
                    Call(
                        Fn("getPublicationsSortedByPopularityScoreCursor"),
                        afterRef
                    ),
            }
        ),
        Lambda(
            ["score", "publication_ref"],
            Call(Fn("getItemPublication"), Var("publication_ref"), true)
        )
    );

export default GetTrendingPublications;
