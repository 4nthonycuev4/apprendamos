import { query } from "faunadb";
const { Let, Select, Get, Var, Add, Update, Now } = query;

const GetSinglePublication = (ref) =>
    Let(
        {
            publication: Update(ref, {
                data: {
                    stats: {
                        readCount: Add(
                            Select(["data", "stats", "readCount"], Get(ref), 0),
                            1
                        ),
                    },
                    lastReadAt: Now(),
                },
            }),
            author: Update(Select(["data", "author"], Var("publication")), {
                data: {
                    stats: {
                        readCount: Add(
                            Select(
                                ["data", "stats", "readCount"],
                                Get(
                                    Select(
                                        ["data", "author"],
                                        Var("publication")
                                    )
                                ),
                                0
                            ),
                            1
                        ),
                    },
                },
            }),
        },
        {
            author: {
                nickname: Select(["data", "nickname"], Var("author")),
                name: Select(["data", "name"], Var("author")),
                picture: Select(["data", "picture"], Var("author")),
                followerCount: Select(
                    ["data", "stats", "followerCount"],
                    Var("author")
                ),
            },
            id: ref,
            body: Select(["data", "body"], Var("publication")),
            publishedAt: Select(["data", "publishedAt"], Var("publication")),
            updatedAt: Select(["data", "updatedAt"], Var("publication"), null),
        }
    );

export default GetSinglePublication;
