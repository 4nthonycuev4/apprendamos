import { query } from "faunadb";
const { Var, Map, Paginate, Index, Lambda, Match } = query;

import { GetPartialUser, GetUserRefByUsername } from "fauna/users/read";

const GetAuthorFollowersAfterCursor = (afterRef) => afterRef;

const GetAuthorFollowers = (username, afterRef) =>
    Map(
        Paginate(
            Match(Index("author_following"), [
                GetUserRefByUsername(username),
                true,
            ]),
            {
                size: 5,
                after:
                    afterRef != null && GetAuthorFollowersAfterCursor(afterRef),
            }
        ),
        Lambda(["ref"], GetPartialUser(Var("ref")))
    );

export default GetAuthorFollowers;
