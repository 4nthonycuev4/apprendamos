/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";

import { query as q, Client } from "faunadb";

import { formatFaunaDoc } from "../../../utils/Fauna";

export default withApiAuthRequired(async function shows(req, res) {
	try {
		const session = getSession(req, res);
		const { accessToken } = await getAccessToken(req, res);

		const client = new Client({
			secret: accessToken,
			domain: process.env.FAUNA_DOMAIN,
		});

		const { name, bio, username } = req.body;

		const profile = await client
			.query(
				q.Create(q.Collection("profiles"), {
					data: {
						name,
						bio,
						username,
						picture: session.user.picture,
						owner: session.user.sub,
						joined: new Date().getTime(),
					},
				})
			)
			.then((doc) => formatFaunaDoc(doc))
			.catch((error) => {
				res
					.status(error.requestResult.statusCode)
					.json({ error: error.description });
			});

		const account = await client
			.query(
				q.Create(q.Collection("accounts"), {
					data: {
						coins: 100,
						owner: session.user.sub,
					},
				})
			)
			.then((doc) => formatFaunaDoc(doc))
			.catch((error) => {
				res
					.status(error.requestResult.statusCode)
					.json({ error: error.description });
			});

		const viewer = {
			profile,
			account,
		};

		res.status(200).json(viewer);
	} catch (error) {
		res
			.status(error.status || 500)
			.json({ error: error.message || "Internal server error" });
	}
});
