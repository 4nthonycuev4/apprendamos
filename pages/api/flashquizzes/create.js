/** @format */

import {
	getAccessToken,
	withApiAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";

import FaunaClient from "./../../../fauna";

export default withApiAuthRequired(async function shows(req, res) {
	try {
		const session = getSession(req, res);

		const { accessToken } = await getAccessToken(req, res);

		const client = new FaunaClient(accessToken, null, session.user);

		const { name, tags, flashcards } = req.body;

		const quiz = await client.createFlashquiz(name, tags, flashcards);

		res.status(200).json(quiz);
	} catch (error) {
		res.status(error.status || 500).json(error);
	}
});
