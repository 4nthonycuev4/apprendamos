/** @format */

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import { getTweetsByUserId } from "../../utils/Fauna";

export default withApiAuthRequired(async function handler(req, res) {
	const session = getSession(req, res);
	const userId = session.user.sub;

	if (req.method !== "GET") {
		return res.status(405);
	}

	try {
		const tweets = await getTweetsByUserId(userId);
		return res.status(200).json(tweets);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: "Something went wrong!" });
	}
});
