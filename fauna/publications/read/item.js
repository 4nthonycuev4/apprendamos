import { query } from "faunadb";
const { Var, Get, Select, SubString, Let } = query;

const GetItemAuthor = (authorRef) =>
    Let(
        {
            author: Get(authorRef),
        },
        {
            name: Select(["data", "name"], Var("author")),
            nickname: Select(["data", "nickname"], Var("author")),
            picture: Select(["data", "picture"], Var("author")),
        }
    );

const GetItemPublication = (publicationRef, withAuthor = true) =>
    Let(
        {
            publication: Get(publicationRef),
            author:
                withAuthor &&
                GetItemAuthor(Select(["data", "author"], Var("publication"))),
        },
        {
            id: publicationRef,
            body: SubString(
                Select(["data", "body"], Var("publication")),
                0,
                200
            ),
            publishedAt: Select(["data", "publishedAt"], Var("publication")),
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
        }
    );

export default GetItemPublication;
