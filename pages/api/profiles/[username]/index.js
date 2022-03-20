/** @format */

import {
	getAccessToken,
	getSession,
	withApiAuthRequired,
} from "@auth0/nextjs-auth0";

import { query as q, Client } from "faunadb";

export default withApiAuthRequired(async function profile(req, res) {
	try {
		const session = getSession(req, res);
		const { accessToken } = await getAccessToken(req, res);

		const { username } = req.query;
		const client = new Client({
			secret: accessToken,
			domain: process.env.FAUNA_DOMAIN,
		});

		const viewerRef = await client.query(
			q.Call(q.Function("getUserByAuth0ID"), session.user.sub)
		);

		const user = await client.query(
			q.Get(q.Call(q.Function("getUserByUsername"), username))
		);

		const viewerIsFollowing = await client.query(
			q.Exists(
				q.Match(
					q.Index("relationship_by_follower_and_followee"),
					viewerRef,
					user.ref
				)
			)
		);

		const followingCount = await client.query(
			q.Count(
				q.Match(
					q.Index("followees_by_follower"),
					q.Call(q.Function("getUserByUsername"), username)
				)
			)
		);

		const followerCount = await client.query(
			q.Count(
				q.Match(
					q.Index("followers_by_followee"),
					q.Call(q.Function("getUserByUsername"), username)
				)
			)
		);

		const testCount = await client.query(
			q.Count(
				q.Match(
					q.Index("tests_by_user"),
					q.Call(q.Function("getUserByUsername"), username)
				)
			)
		);

		const tests = await client
			.query(
				q.Map(
					q.Paginate(
						q.Match(
							q.Index("tests_by_user"),
							q.Call(q.Function("getUserByUsername"), username)
						)
					),
					q.Lambda(["ref"], q.Get(q.Var("ref")))
				)
			)
			.then((docs) =>
				docs.data.map((doc) => ({
					...doc.data,
					id: doc.ref.id,
					ts: doc.ts / 1000,
					user: doc.data.user.id,
				}))
			);

		const data = {
			...user.data,
			id: user.ref.id,
			ts: user.ts / 1000,
			tests,
			followingCount,
			followerCount,
			testCount,
			viewerIsFollowing,
		};

		res.status(200).json(data);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json({ error: error.message });
	}
});
