/** @format */

import FaunaClient from "../../../fauna";

export default async function Content(req, res) {
  try {
    const client = new FaunaClient();

    const { afterId, afterCollection } = req.query


    const content = await client.getFeed(afterId, afterCollection);

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({
      errorCode: 500,
      errorMessage: error.message,
    });
  }
}
