/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";
import { query as q, Client } from "faunadb";

import { formatFaunaDoc } from "../../../../../utils/Fauna";

export default withApiAuthRequired(async function shows(req, res) {
	try {
		const session = getSession(req, res);

		const { accessToken } = await getAccessToken(req, res);

		const client = new Client({
			secret: accessToken,
			domain: process.env.FAUNA_DOMAIN,
		});

		const { quizID } = req.query;

		const { front, back } = req.body;

		const quizExists = await client.query(
			q.Exists(q.Ref(q.Collection("quizzes"), quizID))
		);

		if (!quizExists) {
			res.status(404).json({
				error: "Quiz not found",
			});
		}

		const card = await client
			.query(
				q.Create(q.Collection("cards"), {
					data: {
						front,
						back,
						owner: session.user.sub,
						quiz: q.Ref(q.Collection("quizzes"), quizID),
					},
				})
			)
			.then((doc) => formatFaunaDoc(doc))
			.catch((error) => {
				res
					.status(error.requestResult.statusCode)
					.json({ error: error.description });
			});

		res.status(200).json(card);
	} catch (error) {
		res.status(error.status || 500).json({ error: error.message });
	}
});
