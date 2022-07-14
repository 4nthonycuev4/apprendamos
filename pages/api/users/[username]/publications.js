/** @format */
import {
    getAccessToken,
} from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../fauna";

export default async function getUserPublications(req, res) {
    try {
        const { accessToken } = await getAccessToken(req, res).catch(e => {
            return {};
        });

        const client = new FaunaClient(accessToken);

        let { username } = req.query

        const afterId = req.query && req.query.afterId;

        const content = await client.getUserPublications(username, afterId);

        res.status(200).json(content);
    } catch (error) {
        console.log('errorAPI', error)
        res.status(500).json({
            errorCode: 500,
            errorMessage: error.message,
        });
    }
};
