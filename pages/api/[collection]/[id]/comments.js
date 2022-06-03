/** @format */
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../fauna";

export default withApiAuthRequired(async function comments(req, res) {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        const { collection, id } = req.query;

        let response;

        if (req.method === "POST") {
            const { message } = req.body;
            response = await client.createComment({ collection, id }, message);
        } else if (req.method === "GET") {
            response = await client.getContentComments({ collection, id });
        }

        res.status(200).json(response);
    } catch (error) {
        console.log("error", error);
        res.status(error.status || 500).json(error);
    }
});
