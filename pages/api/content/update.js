/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";

import FaunaClient from "./../../../fauna";

export default withApiAuthRequired(async function updateContent(req, res) {
	try {
		const { accessToken } = await getAccessToken(req, res);

		const client = new FaunaClient(accessToken);

		const { ref, data } = req.body;
		const content = await client.updateContent(ref, data);

		res.status(200).json(content);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json(error);
	}
});
