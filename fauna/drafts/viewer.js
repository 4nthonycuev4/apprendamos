import { query } from "faunadb";
const { Var, Map, Paginate, Index, Lambda } = query;

import GetSinglePublicationDraft from "./single";
import { GetViewerRef } from "../users/read";

const GetViewerPublicationDrafts = (afterRef) =>
    Map(
        Paginate(
            Match(Index("publication_drafts_by_author"), [
                GetViewerRef(),
                true,
            ]),
            {
                size: 5,
                after:
                    afterRef != null &&
                    GetAuthorPublicationsAfterCursor(afterRef),
            }
        ),
        Lambda(["createdAt", "ref"], GetSinglePublicationDraft(Var("ref")))
    );

export default GetViewerPublicationDrafts;
