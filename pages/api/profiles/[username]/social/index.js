/** @format */

import { query as q, Client } from "faunadb";
import { formatFaunaDocs } from "./../../../../../utils/Fauna";

export default async function followers(req, res) {
	try {
		const { username } = req.query;
		const client = new Client({
			secret: process.env.FAUNA_SECRET,
			domain: process.env.FAUNA_DOMAIN,
		});

		let errorCode, errorMessage;

		const followerCount = await client
			.query(
				q.Count(
					q.Match(
						q.Index("followers_by_followee"),
						q.Select(
							["data", "owner"],
							q.Call(q.Function("getProfileByUsername"), username)
						)
					)
				)
			)
			.catch((error) => {
				errorCode = error.requestResult.statusCode;
				errorMessage = error.description;
			});

		if (errorCode) {
			res.status(errorCode).json({
				error: errorMessage,
			});
		}

		const followingCount = await client
			.query(
				q.Count(
					q.Match(
						q.Index("followees_by_follower"),
						q.Select(
							["data", "owner"],
							q.Call(q.Function("getProfileByUsername"), username)
						)
					)
				)
			)
			.catch((error) => {
				errorCode = error.requestResult.statusCode;
				errorMessage = error.description;
			});

		if (errorCode) {
			res.status(errorCode).json({
				error: errorMessage,
			});
		}

		res.status(200).json({
			followerCount,
			followingCount,
		});
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json({ error: error.message });
	}
}
