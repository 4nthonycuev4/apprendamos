import { query } from "faunadb";
import { GetUserByUsername } from "../users/read";
const { Let, Select, Var } = query;

const GetAuthorStats = (username) =>
    Let(
        {
            author: GetUserByUsername(username),
        },
        {
            likeCount: Select(
                ["data", "stats", "likeCount"],
                Var("author"),
                null
            ),
            followerCount: Select(
                ["data", "stats", "followerCount"],
                Var("author"),
                null
            ),
            followingCount: Select(
                ["data", "stats", "followingCount"],
                Var("author"),
                null
            ),
        }
    );

export default GetAuthorStats;
