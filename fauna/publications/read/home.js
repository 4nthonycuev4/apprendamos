import { query } from "faunadb";
const { Index, Var, Match, Paginate, Map, Lambda, Join, Select, Get } = query;

import GetItemPublication from "./item";

import { GetViewerRef } from "../../authors/read";

const GetHomePublicationsAfterCursor = (ref) => [
    Select(["data", "publishedAt"], Get(ref)),
    ref,
];

const GetHomePublications = (afterRef) =>
    Map(
        Paginate(
            Join(
                Join(
                    Match(Index("author_following"), [GetViewerRef(), true]),
                    Index("publications_by_author")
                ),
                Index("publications_sorted_publishedAt")
            ),
            {
                size: 5,
                after:
                    afterRef != null &&
                    GetHomePublicationsAfterCursor(afterRef),
            }
        ),
        Lambda(["publishedAt", "ref"], GetItemPublication(Var("ref")))
    );

export default GetHomePublications;
