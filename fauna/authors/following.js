import { query } from "faunadb";
const { Var, Map, Paginate, Index, Lambda, Match } = query;

import { GetPartialAuthor, GetAuthorRefBynickname } from "fauna/authors/read";

const GetAuthorFollowersAfterCursor = (afterRef) => afterRef;

const GetAuthorFollowers = (nickname, afterRef) =>
    Map(
        Paginate(
            Match(Index("author_following"), [
                GetAuthorRefBynickname(nickname),
                true,
            ]),
            {
                size: 5,
                after:
                    afterRef != null && GetAuthorFollowersAfterCursor(afterRef),
            }
        ),
        Lambda(["ref"], GetPartialAuthor(Var("ref")))
    );

export default GetAuthorFollowers;
