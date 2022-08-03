import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import FaunaClient from "../../../../../fauna";

const SavePublicationAPIPage = async (req, res) => {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        const { id } = req.query;

        await client.savePublication(id);

        res.status(200).send("Transaction succeeded");
    } catch (error) {
        console.error(error);
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default withApiAuthRequired(SavePublicationAPIPage);
