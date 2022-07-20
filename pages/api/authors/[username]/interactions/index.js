import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import FaunaClient from "../../../../../fauna";

const AuthorInteractionsAPIPage = async (req, res) => {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        const { username } = req.query;

        const interactions = await client.getAuthorInteractions(username);

        res.status(200).json(interactions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

export default withApiAuthRequired(AuthorInteractionsAPIPage);
