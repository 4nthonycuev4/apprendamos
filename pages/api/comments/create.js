/** @format */

import {
  getAccessToken,
  getSession,
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";

import FaunaClient from "../../../fauna";

export default withApiAuthRequired(async function createComment(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    const session = getSession(req, res);

    const client = new FaunaClient(accessToken, session.user);

    const { ref, message, coins } = req.body;
    const comment = await client.createComment(ref, message, coins);

    res.status(200).json(comment);
  } catch (error) {
    console.log("error", error);
    res.status(error.status || 500).json(error);
  }
});
