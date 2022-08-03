import FaunaClient from "fauna";

export default async function getTrendingAuthors(req, res) {
    try {
        const client = new FaunaClient();

        const afterId = req.query && req.query.afterId;
        const users = await client.getTrendingAuthors(afterId);

        res.status(200).json(users);
    } catch (error) {
        console.log("error", error);
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
}
