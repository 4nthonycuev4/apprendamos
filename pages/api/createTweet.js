/** @format */

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import { createTweet } from "../../utils/Fauna";

export default withApiAuthRequired(async function handler(req, res) {
	const session = getSession(req, res);
	const userId = session.user.sub;

	const { title, topic, body } = req.body;
	if (req.method !== "POST") {
		return res.status(405).json({ msg: "Method not allowed" });
	}
	try {
		const createdTweet = await createTweet(title, topic, body, userId);
		res.status(200).json(createdTweet);
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: "Something went wrong." });
	}
});
