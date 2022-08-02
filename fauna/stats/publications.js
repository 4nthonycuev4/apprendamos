import { query } from "faunadb";
const { Let, Select, Get, Var } = query;

const GetPublicationStats = (ref) =>
    Let(
        {
            publication: Get(ref),
        },
        {
            like_count: Select(
                ["data", "stats", "like_count"],
                Var("publication"),
                null
            ),
            cheer_count: Select(
                ["data", "stats", "cheer_count"],
                Var("publication"),
                null
            ),
            comment_count: Select(
                ["data", "stats", "comment_count"],
                Var("publication"),
                null
            ),
        }
    );

export default GetPublicationStats;
