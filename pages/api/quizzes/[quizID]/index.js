/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";

import { query as q, Client } from "faunadb";

export default async function shows(req, res) {
	try {
		const { testID } = req.query;

		const client = new Client({
			secret: process.env.FAUNA_SECRET,
			domain: process.env.FAUNA_DOMAIN,
		});

		const test = await client
			.query(q.Get(q.Ref(q.Collection("tests"), testID)))
			.then((doc) => ({ ...doc.data, id: doc.ref.id, ts: doc.ts / 1000 }))
			.catch((error) => {
				res.status(error.requestResult.statusCode || 500).json({
					error: error.description,
				});
			});

		const profile = await client.query(
			q.Get(q.Ref(q.Collection("profiles"), doc.data.user.id))
		);

		const docs = await client.query(
			q.Map(
				q.Paginate(
					q.Match(
						q.Index("cards_by_test"),
						q.Ref(q.Collection("tests"), testID)
					)
				),
				q.Lambda(["ref"], q.Get(q.Var("ref")))
			)
		);

		const cards = docs.data.map((doc) => {
			return {
				...doc.data,
				id: doc.ref.id,
				ts: doc.ts / 1000,
				user: doc.data.user.id,
				test: doc.data.test.id,
			};
		});

		const test1 = {
			...doc.data,
			id: doc.ref.id,
			ts: doc.ts / 1000,
			user: { ...user.data, id: user.ref.id, ts: user.ts / 1000 },
			cards,
		};
		res.status(200).json(test);
	} catch (error) {
		res.status(error.status || 500).json({ error: error.message });
	}
}
