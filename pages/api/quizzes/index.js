/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";

import { query as q, Client } from "faunadb";
import { formatFaunaDocs } from "../../../utils/Fauna";

export default withApiAuthRequired(async function quizzes(req, res) {
	try {
		const session = getSession(req, res);
		const { accessToken } = await getAccessToken(req, res);

		const client = new Client({
			secret: accessToken,
			domain: process.env.FAUNA_DOMAIN,
		});

		const quizzes = await client
			.query(
				q.Map(
					q.Paginate(
						q.Join(
							q.Join(
								q.Match(q.Index("followees_by_follower"), session.user.sub),
								q.Index("quizzes_by_owner")
							),
							q.Index("quizzes_sort_by_ts_desc")
						)
					),
					q.Lambda(["ts", "ref"], q.Get(q.Var("ref")))
				)
			)
			.then((res) => formatFaunaDocs(res.data))
			.catch((error) => {
				console.log("error", error);
			});

		res.status(200).json(quizzes);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json({ error: error.message });
	}
});
