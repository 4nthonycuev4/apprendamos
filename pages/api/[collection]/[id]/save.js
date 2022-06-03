import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../fauna";

export default withApiAuthRequired(async function save(req, res) {
    try {
        const { collection, id } = req.query;

        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        const response = await client.save({ collection, id });

        res.status(200).json(response);
    } catch (error) {
        console.log("error", error);
        res.status(error.status || 500).json(error);
    }
});
