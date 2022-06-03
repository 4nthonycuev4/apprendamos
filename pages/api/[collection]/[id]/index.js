/** @format */

import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../fauna";

export default withApiAuthRequired(async function deleteContent(req, res) {
    try {
        const { collection, id } = req.query;
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        let response;

        if (req.method === "DELETE") {
            response = await client.deleteContent({ collection, id });
        } else if (req.method === "GET") {
            response = await client.getSingleContent({ collection, id });
        }

        if (response.error) {
            if (response.error.description.includes("forbidden")) {
                return res.status(403).json(response.error);
            }
            if (response.error.description.includes("not exist")) {
                return res.status(404).json(response.error);
            }
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(error.status || 500).json(error);
    }
});
