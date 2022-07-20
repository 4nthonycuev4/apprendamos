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
    SubString,
    Map,
} = query;

import { GetViewerRef, GetPartialUser } from "../../users/read";

const GetSavedPublicationsAfterCursor = (ref) =>
    Let(
        {
            interactions: Get(ref),
        },
        [
            Select(["data", "savedAt"], Var("interactions")),
            Select(["data", "publication"], Var("interactions")),
            ref,
        ]
    );

const GetSavedPublications = (afterRef) =>
    Let(
        { viewerRef: GetViewerRef() },
        Map(
            Paginate(
                Match(Index("saved_publications"), [Var("viewerRef"), true]),
                {
                    size: 5,
                    after:
                        afterRef != null &&
                        GetSavedPublicationsAfterCursor(
                            afterRef,
                            GetViewerRef()
                        ),
                }
            ),
            Lambda(
                ["savedAt", "publicationRef"],
                Let(
                    {
                        publication: Get(Var("publicationRef")),
                        author: GetPartialUser(
                            Select(["data", "author"], Var("publication"))
                        ),
                    },
                    {
                        id: Var("publicationRef"),
                        body: SubString(
                            Select(["data", "body"], Var("publication")),
                            0,
                            200
                        ),
                        publishedAt: Select(
                            ["data", "publishedAt"],
                            Var("publication")
                        ),
                        stats: {
                            likeCount: Select(
                                ["data", "stats", "likeCount"],
                                Var("publication"),
                                null
                            ),
                            cheerCount: Select(
                                ["data", "stats", "cheerCount"],
                                Var("publication"),
                                null
                            ),
                            commentCount: Select(
                                ["data", "stats", "commentCount"],
                                Var("publication"),
                                null
                            ),
                        },
                        author: Var("author"),
                        savedAt: Var("savedAt"),
                    }
                )
            )
        )
    );

export default GetSavedPublications;
