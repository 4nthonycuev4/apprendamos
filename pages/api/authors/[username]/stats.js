import FaunaClient from "../../../../fauna";

const AuthorStatsAPIPage = async (req, res) => {
    try {
        const client = new FaunaClient();

        const { username } = req.query;
        const stats = await client.getAuthorStats(username);

        res.status(200).json(stats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

export default AuthorStatsAPIPage;
