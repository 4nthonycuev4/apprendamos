/** @format */

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import { deleteTweet, getTweetById } from "../../utils/Fauna";

export default withApiAuthRequired(async function handler(req, res) {
	if (req.method !== "DELETE") {
		return res.status(405).json({ msg: "Method not allowed" });
	}

	const session = getSession(req, res);
	const userId = session.user.sub;

	const { id } = req.body;

	const existingTweet = await getTweetById(id);

	if (!existingTweet) {
		return res.status(404).json({ msg: "Record not found" });
	} else if (existingTweet.data.userId !== userId) {
		return res.status(403).json({ msg: "Unauthorized" });
	}

	try {
		const deletedTweet = await deleteTweet(id);
		return res.status(200).json(deletedTweet);
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: "Something went wrong." });
	}
});
