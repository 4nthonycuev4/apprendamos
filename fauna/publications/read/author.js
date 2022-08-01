import { query } from "faunadb";
const { Select, Index, Get, Var, Match, Paginate, Map, Join, Lambda } = query;

import GetItemPublication from "./item";
import { GetAuthorRefBynickname } from "../../authors/read";

const GetAuthorPublicationsAfterCursor = (ref) => [
    Select(["data", "publishedAt"], Get(ref)),
    ref,
];

const GetAuthorPublications = (nickname, afterRef) =>
    Map(
        Paginate(
            Join(
                Match(Index("publications_by_author"), [
                    GetAuthorRefBynickname(nickname),
                ]),
                Index("publications_sorted_publishedAt")
            ),
            {
                size: 5,
                after:
                    afterRef != null &&
                    GetAuthorPublicationsAfterCursor(afterRef),
            }
        ),
        Lambda(["publishedAt", "ref"], GetItemPublication(Var("ref"), false))
    );

export default GetAuthorPublications;
