/** @format */

import { updateTweet, getTweetById } from "../../utils/Fauna";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(req, res) {
	if (req.method !== "PUT") {
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

	const { name, language, description, code } = req.body;

	try {
		const updatedTweet = await updateTweet(
			id,
			name,
			language,
			description,
			code
		);
		res.status(200).json(updatedTweet);
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: "Something went wrong." });
	}
});
