/** @format */

import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "./../../../fauna";

export default withApiAuthRequired(async function deleteContent(req, res) {
	try {
		const { accessToken } = await getAccessToken(req, res);

		const client = new FaunaClient(accessToken);

		const { ref } = req.body;
		const content = await client.deleteContent(ref);

		res.status(200).json(content);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json(error);
	}
});
