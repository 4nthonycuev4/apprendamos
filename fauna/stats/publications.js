import { query } from "faunadb";
const { Let, Select, Get, Var } = query;

const GetPublicationStats = (ref) =>
    Let(
        {
            publication: Get(ref),
        },
        {
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
        }
    );

export default GetPublicationStats;
