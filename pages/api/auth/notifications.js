import {
    getAccessToken,
    withApiAuthRequired,
} from "@auth0/nextjs-auth0";

import FaunaClient from "../../../fauna";

const NotificationAPIPage = async (req, res) => {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        const afterId = req.query && req.query.afterId

        const notifications = await client.getNotifications(afterId);

        res.status(200).json(notifications);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

export default withApiAuthRequired(NotificationAPIPage);