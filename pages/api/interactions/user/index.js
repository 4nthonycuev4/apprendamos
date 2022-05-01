/** @format */
/** @format */

import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../fauna";

export default withApiAuthRequired(async function getViewerContentStats(
	req,
	res
) {
	try {
		const { username } = req.body;

		const { accessToken } = await getAccessToken(req, res);
		const client = new FaunaClient(accessToken);

		const stats = await client.getViewerAuthorStats(username);

		res.status(200).json(stats);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json(error);
	}
});
