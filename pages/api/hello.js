const HelloAPIPage = async (req, res) => {
    try {
        if (req.method === "GET") {
            res.status(200).send("Hello World!");
        }
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default HelloAPIPage;
