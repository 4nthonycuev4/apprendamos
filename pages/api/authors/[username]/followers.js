/** @format */

import FaunaClient from "fauna";

const AuthorFollowersAPI = async (req, res) => {
    try {
        const client = new FaunaClient();

        const { username } = req.query;
        const afterId = req.query && req.query.afterId;

        const content = await client.getAuthorFollowers(username, afterId);

        res.status(200).json(content);
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default AuthorFollowersAPI;
