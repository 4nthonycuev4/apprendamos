import { query } from "faunadb";
import { GetAuthorBynickname } from "../authors/read";
const { Let, Select, Var } = query;

const GetAuthorStats = (nickname) =>
    Let(
        {
            author: GetAuthorBynickname(nickname),
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
