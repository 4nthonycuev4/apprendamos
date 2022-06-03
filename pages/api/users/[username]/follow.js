/** @format */

import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../fauna";

export default withApiAuthRequired(async function users(req, res) {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        const { username } = req.query

        const user = await client.follow(username);

        res.status(200).json(user);
    } catch (error) {
        console.log("error", error);
        res.status(error.status || 500).json(error);
    }
});
