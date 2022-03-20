/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";

import { query as q, Client } from "faunadb";

export default withApiAuthRequired(async function shows(req, res) {
	try {
		const { username } = req.query;
		const session = getSession(req, res);
		const { accessToken } = await getAccessToken(req, res);

		const client = new Client({
			secret: accessToken,
			domain: process.env.FAUNA_DOMAIN,
		});

		const follower = session.user.sub;
		const followee = q.Select(
			["data", "owner"],
			q.Call(q.Function("getProfileByUsername"), username)
		);

		const relationshipRef = await client
			.query(
				q.Select(
					["ref"],
					q.Get(
						q.Match(q.Index("relationship_by_follower_and_followee"), [
							follower,
							followee,
						])
					)
				)
			)
			.catch((err) => {
				if (err.requestResult.statusCode === 404) {
					return null;
				} else {
					console.log("err", err);
					res.status(400).json({
						error: "internal faunadb error",
					});
				}
			});

		res.status(200).json(Boolean(relationshipRef));
	} catch (error) {
		console.log("error", error);
		res.status(500).json({ error: "internal nextjs error" });
	}
});
