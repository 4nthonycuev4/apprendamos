/** @format */

import FaunaClient from "../../../fauna";

export default async function Search(req, res) {
    try {
        const client = new FaunaClient();

        const { searchString } = req.query;

        console.log('searchString', searchString)

        const content = await client.search(searchString);

        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({
            errorCode: 500,
            errorMessage: error.message,
        });
    }
}
