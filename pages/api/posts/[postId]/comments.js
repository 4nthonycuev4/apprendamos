/** @format */

import FaunaClient from "../../../../fauna";

export default async function PostComments(req, res) {
	try {
		const client = new FaunaClient();

		const { postId } = req.query;
		const post = await client.getPostComments(postId);

		res.status(200).json(post);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json(error);
	}
}
