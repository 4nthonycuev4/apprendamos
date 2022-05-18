/** @format */

import FaunaClient from "../../../../fauna";

export default async function getComments(req, res) {
    try {
        const { collection, id } = req.query;
        const client = new FaunaClient();
        const comments = await client.getContentComments({ collection, id });

        res.status(200).json(comments);
    } catch (error) {
        console.log("error", error);
        res.status(error.status || 500).json(error);
    }
}
