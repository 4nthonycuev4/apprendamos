import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../fauna";

const SinglePublicationDraftAPI = async (req, res) => {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);
        const { id } = req.query;

        if (req.method === "DELETE") {
            const id = await client.deletePublicationDraft({ collection, id });
            res.status(200).json(id);
        } else if (req.method === "GET") {
            const response = await client.getPublicationDraft(id);
            res.status(200).json(response);
        } else if (req.method === "PUT") {
            const { body } = req.body;
            if (!body || body.length === 0) {
                const response = await client.publishPublicationDraft(id);
                res.status(200).json(response);
            } else {
                const response = await client.updatePublicationDraft(id, body);
                res.status(200).json(response);
            }
        } else {
            res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default withApiAuthRequired(SinglePublicationDraftAPI);
