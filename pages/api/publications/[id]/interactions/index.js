import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import FaunaClient from "../../../../../fauna";

const PublicationInteractionsAPIPage = async (req, res) => {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        const { id } = req.query;

        const interactions = await client.getPublicationInteractions(id);

        res.status(200).json(interactions);
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default withApiAuthRequired(PublicationInteractionsAPIPage);
