import FaunaClient from "../../../../fauna";

const AuthorStatsAPIPage = async (req, res) => {
    try {
        const client = new FaunaClient();

        const { nickname } = req.query;
        const stats = await client.getAuthorStats(nickname);

        res.status(200).json(stats);
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default AuthorStatsAPIPage;
