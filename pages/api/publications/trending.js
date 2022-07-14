import { getAccessToken } from "@auth0/nextjs-auth0";
import FaunaClient from "../../../fauna";

const TrendingPublications = async (req, res) => {
    try {
        const { accessToken } = await getAccessToken(req, res).catch(e => {
            return {};
        });

        const client = new FaunaClient(accessToken);

        const publications = await client.getTrendingPublications();

        return res.status(200).json(publications);
    } catch (error) {
        console.log("error", error);
        res.status(error.status || 500).json(error);
    }
}

export default TrendingPublications;