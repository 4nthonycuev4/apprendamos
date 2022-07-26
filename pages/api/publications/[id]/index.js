/** @format */

import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../fauna";

export default withApiAuthRequired(async function handleSingleContentRequest(
    req,
    res
) {
    try {
        const { id } = req.query;
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        if (req.method === "DELETE") {
            const id = await client.deleteContent({ collection, id });
            return res.status(200).json(response);
        } else if (req.method === "PUT") {
            const { body, isDraft, isQuestion } = req.body;
            const updated = await client.updatePublication(
                id,
                body,
                isDraft,
                isQuestion
            );
            return res.status(200).json(updated);
        } else if (req.method === "GET") {
            const publication = await client.getPublication(id);
            return res.status(200).json(publication);
        }

        if (response.error) {
            if (response.error.description.includes("forbidden")) {
                return res.status(403).json(response.error);
            }
            if (response.error.description.includes("not exist")) {
                return res.status(404).json(response.error);
            }
        }
    } catch (error) {
        return res.status(error.status || 500).json(error);
    }
});
