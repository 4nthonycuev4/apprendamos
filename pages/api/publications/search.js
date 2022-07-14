/** @format */

import FaunaClient from "../../../fauna";

export default async function Search(req, res) {
    try {
        const client = new FaunaClient();

        const { str } = req.query;

        const content = await client.searchPublications(str);

        res.status(200).json(content);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errorCode: 500,
            errorMessage: error.message,
        });
    }
}
