/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";

import FaunaClient from "./../../../fauna";

export default withApiAuthRequired(async function createPost(req, res) {
	try {
		const { accessToken } = await getAccessToken(req, res);
		const session = getSession(req, res);

		const client = new FaunaClient(accessToken, null, session.user);

		const { body, tags } = req.body;
		const post = await client.createPost(body, tags);

		res.status(200).json(post);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json(error);
	}
});
