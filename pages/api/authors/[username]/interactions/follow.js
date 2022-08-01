import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import FaunaClient from "fauna";

const FollowAuthorAPIPage = async (req, res) => {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        const { username } = req.query;

        await client.followAuthor(username);

        res.status(200).send("Transaction succeeded");
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default withApiAuthRequired(FollowAuthorAPIPage);
