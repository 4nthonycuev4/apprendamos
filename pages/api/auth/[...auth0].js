/** @format */

import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../fauna";

const afterCallback = async (req, res, session, state) => {
	const client = new FaunaClient(session.accessToken, null, session.user.sub);
	const accountConnection = session.user.sub;
	const viewer = await client.getViewer();

	if (!viewer) {
		state.returnTo = "/register";
		return session;
	} else {
		session.user = viewer;
		session.user.accountConnection = accountConnection;

		return session;
	}
};

export default handleAuth({
	async callback(req, res) {
		try {
			await handleCallback(req, res, { afterCallback });
		} catch (error) {
			res.status(error.status || 500).end(error.message);
		}
	},
});
