import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import FaunaClient from "../../../../../fauna";

const LikePublicationAPIPage = async (req, res) => {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        const { id } = req.query;

        await client.likePublication(id);

        res.status(200).send("Transaction succeeded");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

export default withApiAuthRequired(LikePublicationAPIPage);
