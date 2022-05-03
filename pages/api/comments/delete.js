/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";

import FaunaClient from "../../../fauna";

export default withApiAuthRequired(async function deleteComment(req, res) {
	try {
		const { accessToken } = await getAccessToken(req, res);
		const session = getSession(req, res);

		const client = new FaunaClient(accessToken, session.user);

		const { commentRef } = req.body;
		const comment = await client.deleteComment(commentRef);

		res.status(200).json(comment);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json(error);
	}
});
