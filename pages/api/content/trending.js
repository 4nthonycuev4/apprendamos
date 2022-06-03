/** @format */
import {
    getAccessToken,
    withApiAuthRequired,
} from "@auth0/nextjs-auth0";

import FaunaClient from "../../../fauna";

export default withApiAuthRequired(async function createContent(req, res) {
    try {
        const { accessToken } = await getAccessToken(req, res);

        const client = new FaunaClient(accessToken);

        const after = req.query
            && req.query.after
            && {
            collection: req.query.after.split("/")[0],
            id: req.query.after.split("/")[1]
        };

        const content = await client.getTrendingContent(after);

        res.status(200).json(content);
    } catch (error) {
        console.log('errorAPI', error)
        res.status(500).json({
            errorCode: 500,
            errorMessage: error.message,
        });
    }
});
