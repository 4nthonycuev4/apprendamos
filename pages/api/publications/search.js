/** @format */

import FaunaClient from "../../../fauna";

export default async function Search(req, res) {
    try {
        const client = new FaunaClient();

        const { str } = req.query;

        const content = await client.searchPublications(str);

        res.status(200).json(content);
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
}
