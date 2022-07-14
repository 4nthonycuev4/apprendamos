/** @format */
import { getAccessToken, } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../fauna";

export default async function createContent(req, res) {
    try {
        const { accessToken } = await getAccessToken(req, res).catch(e => {
            return {};
        });

        const client = new FaunaClient(accessToken);

        let { username } = req.query

        const after = req.query
            && req.query.after
            && {
            collection: req.query.after.split("/")[0],
            id: req.query.after.split("/")[1]
        };

        const content = await client.getFollowers(username, after);

        res.status(200).json(content);
    } catch (error) {
        console.log('errorAPI', error)
        res.status(500).json({
            errorCode: 500,
            errorMessage: error.message,
        });
    }
};
