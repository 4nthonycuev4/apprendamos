import FaunaClient from "../../../../fauna";

const PublicationStatsAPIPage = async (req, res) => {
    try {

        const client = new FaunaClient();

        const { id } = req.query;

        const stats = await client.getPublicationStats(id);

        res.status(200).json(stats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

export default PublicationStatsAPIPage;