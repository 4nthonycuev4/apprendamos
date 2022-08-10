import { query } from "faunadb";
const { Call, Function: Fn, Index, Var, Match, Paginate, Map, Lambda } = query;

const GetAuthorPublications = (nickname, afterRef) =>
    Map(
        Paginate(
            Match(
                Index("publications_by_author"),
                Call(Fn("getAuthorRefByNickname"), nickname)
            ),
            {
                size: 5,
                after: afterRef != null && afterRef,
            }
        ),
        Lambda(["ref"], Call(Fn("getItemPublication"), Var("ref"), false))
    );

export default GetAuthorPublications;
