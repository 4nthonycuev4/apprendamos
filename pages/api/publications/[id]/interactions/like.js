import {
    getAccessToken,
    withApiAuthRequired,
    getSession,
} from "@auth0/nextjs-auth0";
import FaunaClient from "fauna";

const LikePublicationAPIPage = async (req, res) => {
    try {
        const { accessToken } = await getAccessToken(req, res);
        console.log("accessToken", accessToken);
        const session = getSession(req, res);
        console.log("session", session);
        const client = new FaunaClient(accessToken);

        const { id } = req.query;

        await client.likePublication(id);

        res.status(200).send("Transaction succeeded");
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default withApiAuthRequired(LikePublicationAPIPage);
