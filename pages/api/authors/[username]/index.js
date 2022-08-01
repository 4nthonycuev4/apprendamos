/** @format */

import { getAccessToken } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../fauna";

export default async function users(req, res) {
    try {
        const { accessToken } = await getAccessToken(req, res).catch((e) => {
            return {};
        });

        const client = new FaunaClient(accessToken);

        const { username } = req.query;

        const user = await client.getSingleUser(username);

        res.status(200).json(user);
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
}
