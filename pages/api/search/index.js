/** @format */

import FaunaClient from "../../../fauna";

export default async function Search(req, res) {
    try {
        const client = new FaunaClient();

        const { searchString } = req.query;

        const content = await client.search(searchString);

        res.status(200).json(content);
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
}
