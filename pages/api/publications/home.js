/** @format */

import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../fauna";

export default withApiAuthRequired(async function handlePublications(req, res) {
    try {
        const { accessToken } = await getAccessToken(req, res);

        const client = new FaunaClient(accessToken);

        if (req.method === "POST") {
            const { body } = req.body;
            if (!body || !body.length || body.length < 10) {
                res.status(400).send("Body is required");
                return;
            }
            const createdPublicationId = await client.createPublication(body);
            res.status(200).json(createdPublicationId);
            return;
        } else if (req.method === "GET") {
            const afterId = req.query && req.query.afterId;
            const publications = await client.getHomePublications(afterId);
            res.status(200).json(publications);
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
});
