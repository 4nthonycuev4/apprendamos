import {
    getAccessToken,
    withApiAuthRequired,
    getSession,
} from "@auth0/nextjs-auth0";
import FaunaClient from "../../../fauna";

const CreatePublicationAPIPage = async (req, res) => {
    try {
        const session = getSession(req, res);
        console.log("session", session);
        const { accessToken } = await getAccessToken(req, res);
        console.log(accessToken);
        const client = new FaunaClient(accessToken);

        if (req.method === "POST") {
            const { draft_id, hashtags } = req.body;
            const response = await client.createPublication(draft_id, hashtags);
            res.status(200).json(response);
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default withApiAuthRequired(CreatePublicationAPIPage);
