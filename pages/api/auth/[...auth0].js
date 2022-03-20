/** @format */

import { handleAuth, handleCallback, handleProfile } from "@auth0/nextjs-auth0";

import { query as q, Client } from "faunadb";

import { formatFaunaDoc } from "../../../utils/Fauna";

const afterCallback = async (req, res, session, state) => {
	const client = new Client({
		secret: session.accessToken,
		domain: process.env.FAUNA_DOMAIN,
	});

	session.user.registered = true;

	const profile = await client
		.query(q.Call(q.Function("getProfile"), session.user.sub))
		.then((doc) => formatFaunaDoc(doc))
		.catch(() => {
			session.user.registered = false;
			state.returnTo = "/settings/profile/create";
		});

	const account = await client
		.query(q.Call(q.Function("getAccount"), session.user.sub))
		.then((doc) => formatFaunaDoc(doc))
		.catch(() => {
			session.user.registered = false;
			state.returnTo = "/settings/profile/create";
		});

	session.user.profile = profile;
	session.user.account = account;

	return session;
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
