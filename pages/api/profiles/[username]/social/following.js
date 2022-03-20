/** @format */

import { query as q, Client } from "faunadb";
import { formatFaunaDocs } from "../../../../../utils/Fauna";

export default async function followers(req, res) {
	try {
		const { username } = req.query;
		const client = new Client({
			secret: process.env.FAUNA_SECRET,
			domain: process.env.FAUNA_DOMAIN,
		});

		let errorCode, errorMessage;

		const followers = await client
			.query(
				q.Map(
					q.Paginate(
						q.Match(
							q.Index("followees_by_follower"),
							q.Select(
								["data", "owner"],
								q.Call(q.Function("getProfileByUsername"), username)
							)
						)
					),
					q.Lambda(["owner"], q.Call(q.Function("getProfile"), q.Var("owner")))
				)
			)
			.then((res) => formatFaunaDocs(res.data))
			.catch((err) => {
				errorMessage =
					err.requestResult.responseContent.errors[0].cause[0].code;
				if (errorMessage === "instance not found") {
					errorMessage = "profile not found";
					errorCode = 404;
				} else {
					console.log("err", err);
					errorMessage = "internal faunadb error";
					errorCode = 400;
				}
				return null;
			});

		if (errorCode) {
			res.status(errorCode).json({
				error: errorMessage,
			});
		} else {
			res.status(200).json(followers);
		}
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json({ error: error.message });
	}
}
