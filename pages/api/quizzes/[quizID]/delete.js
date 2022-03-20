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
		const { quizID } = req.query;

		const { accessToken } = await getAccessToken(req, res);

		const client = new Client({
			secret: accessToken,
			domain: process.env.FAUNA_DOMAIN,
		});

		const quiz = await client
			.query(q.Delete(q.Ref(q.Collection("quizzes"), quizID)))
			.then((doc) => formatFaunaDoc(doc))
			.catch((error) => {
				res
					.status(error.requestResult.statusCode)
					.json({ error: error.description });
			});

		res.status(200).json(quiz);
	} catch (error) {
		res.status(error.status || 500).json(error);
	}
});
