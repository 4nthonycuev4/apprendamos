/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";
import { query as q, Client } from "faunadb";

import { formatFaunaDoc } from "../../../../utils/Fauna";

export default withApiAuthRequired(async function shows(req, res) {
	try {
		const { username: u } = req.query;

		const session = getSession(req, res);

		const { accessToken } = await getAccessToken(req, res);

		const client = new Client({
			secret: accessToken,
			domain: process.env.FAUNA_DOMAIN,
		});

		const { name, bio, username } = req.body;

		const profile = await client
			.query(
				q.Update(
					q.Select(["ref"], q.Call(q.Function("getProfileByUsername"), [u])),
					{
						data: {
							name,
							bio,
							username,
							owner: session.user.sub,
						},
					}
				)
			)
			.then((doc) => formatFaunaDoc(doc))
			.catch((error) => {
				console.log("error", error);
				res
					.status(error.requestResult.statusCode)
					.json({ error: error.description });
			});

		res.status(200).json(profile);
	} catch (error) {
		res.status(error.status || 500).json(error);
	}
});
