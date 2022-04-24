/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";

import FaunaClient from "./../../../fauna";

export default withApiAuthRequired(async function shows(req, res) {
	try {
		const session = getSession(req, res);
		const { accessToken } = await getAccessToken(req, res);

		const client = new FaunaClient(
			accessToken,
			session.user.accountConnection,
			session.user.ref.id
		);

		const { name, about, username, picture } = req.body;

		const user = await client.updateUser(name, about, username, picture);

		res.status(200).json(user);
	} catch (error) {
		res
			.status(error.status || 500)
			.json({ error: error.message || "Internal server error" });
	}
});
