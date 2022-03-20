/** @format */

import { query as q, Client } from "faunadb";

export default async function QuizzesByTag(req, res) {
	try {
		const { tag } = req.query;
		const client = new Client({
			secret: process.env.FAUNA_SECRET,
			domain: process.env.FAUNA_DOMAIN,
		});

		const docs = await client.query(
			q.Map(
				q.Paginate(q.Match(q.Index("quizzes_by_tag"), tag)),
				q.Lambda(["ref"], q.Get(q.Var("ref")))
			)
		);

		const tests = docs.data.map((doc) => {
			return {
				...doc.data,
				id: doc.ref.id,
				ts: doc.ts / 1000,
				user: doc.data.user.id,
			};
		});

		res.status(200).json(tests);
	} catch (error) {
		res.status(error.status || 500).json({ error: error.message });
	}
}
