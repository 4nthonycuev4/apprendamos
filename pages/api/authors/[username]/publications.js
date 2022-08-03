/** @format */

import FaunaClient from "../../../../fauna";

const UserPublicationsAPIPage = async (req, res) => {
    try {
        const client = new FaunaClient();

        const { nickname } = req.query;
        const afterId = req.query && req.query.afterId;

        const content = await client.getAuthorPublications(nickname, afterId);

        res.status(200).json(content);
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default UserPublicationsAPIPage;
