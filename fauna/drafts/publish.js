import { query } from "faunadb";
const { Select, Update, Now, Var, Get, Let, Add, Do } = query;

const PublishPublicationDraft = (ref) =>
    Let(
        {
            publication: Update(ref, {
                data: {
                    isDraft: false,
                    isBlocked: false,
                    publishedAt: Now(),
                },
            }),
            authorRef: Select(["data", "author"], Var("publication")),
            author: Get(Var("authorRef")),
        },
        Do(
            Update(Var("authorRef"), {
                data: {
                    stats: {
                        publicationCount: Add(
                            Select(
                                ["data", "stats", "publicationCount"],
                                Var("author"),
                                0
                            ),
                            1
                        ),
                    },
                },
            }),
            0
        )
    );

export default PublishPublicationDraft;
