import FaunaClient from "../../../fauna";

const TrendingPublications = async (req, res) => {
    try {
        const client = new FaunaClient();
        const afterId = req.query && req.query.afterId;

        const publications = await client.getTrendingPublications(afterId);

        res.status(200).json(publications);
    } catch (error) {
        console.log("error", error);
        res.status(error.status || 500).json({ error });
    }
}

export default TrendingPublications;