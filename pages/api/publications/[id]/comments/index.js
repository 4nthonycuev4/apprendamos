/** @format */

import FaunaClient from "fauna";

const PublicationCommentsAPI = async (req, res) => {
    try {
        const client = new FaunaClient();

        const { id: publicationId } = req.query;
        const afterId = req.query && req.query.afterId;

        const data = await client.getPublicationComments(
            publicationId,
            afterId
        );

        res.status(200).json(data);
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default PublicationCommentsAPI;
