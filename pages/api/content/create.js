/** @format */

import {
  getAccessToken,
  getSession,
  withApiAuthRequired,
} from "@auth0/nextjs-auth0";

import FaunaClient from "../../../fauna";

export default withApiAuthRequired(async function createContent(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);

    const client = new FaunaClient(accessToken);

    const { data, type } = req.body;
    const content = await client.createContent(data, type);

    res.status(200).json(content);
  } catch (error) {
    console.log("error", error);
    res.status(error.status || 500).json(error);
  }
});
