/** @format */

import FaunaClient from "../../../fauna";

export default async function getTrendingUsers(req, res) {
    try {
        const client = new FaunaClient();

        const afterId = req.query && req.query.afterId;
        const users = await client.getTrendingUsers(afterId);

        res.status(200).json(users);
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
}
