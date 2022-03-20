/** @format */

import { query as q, Client } from "faunadb";

export default async function tests(req, res) {
	try {
		const { username } = req.query;
		const client = new Client({
			secret: process.env.FAUNA_SECRET,
			domain: process.env.FAUNA_DOMAIN,
		});

		const docs = await client.query(
			q.Map(
				q.Paginate(
					q.Match(
						q.Index("tests_by_user"),
						q.Call(q.Function("getUser"), username)
					)
				),
				q.Lambda(["ref"], q.Get(q.Var("ref")))
			)
		);

		const data = docs.data.map((doc) => {
			return {
				...doc.data,
				id: doc.ref.id,
				ts: doc.ts / 1000,
				user: doc.data.user.id,
			};
		});

		res.status(200).json(data);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json({ error: error.message });
	}
}
