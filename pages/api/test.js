/** @format */
import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";

import FaunaClient from "../../fauna";

export default withApiAuthRequired(async function shows(req, res) {
	try {
		const { accessToken } = await getAccessToken(req, res);

		const client = new FaunaClient(accessToken);

		const resx = await client.Test();

		res.status(200).json(resx);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json(error);
	}
});
