/** @format */

import FaunaClient from "../../../../fauna";

export default async function getComments(req, res) {
    try {
        const client = new FaunaClient();

        const { questionId, afterId } = req.query;

        const comments = await client.getContentComments({ collection: "questions", id: questionId }, afterId);

        res.status(200).json(comments);
    } catch (error) {
        console.log("error", error);
        res.status(error.status || 500).json(error);
    }
}
