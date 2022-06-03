/** @format */

import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../fauna";

export default withApiAuthRequired(async function shows(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);

    const client = new FaunaClient(accessToken);

    const user = await client.updateViewer(req.body);

    res.status(200).json(user);
  } catch (error) {
    console.log("error", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
});
