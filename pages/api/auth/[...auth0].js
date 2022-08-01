/** @format */

import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";

import FaunaClient from "fauna";

const afterCallback = async (req, res, session, state) => {
    try {
        const client = new FaunaClient(session.accessToken);
        const viewer = await client.getViewer();

        session.user = viewer;

        return session;
    } catch (error) {
        console.log("error", error);
        state.returnTo = "/signup/step-2";
        return session;
    }
};

export default handleAuth({
    async callback(req, res) {
        try {
            await handleCallback(req, res, { afterCallback });
        } catch (error) {
            console.error("error auth", error);
            res.status(error.status || 500).end(error.message);
        }
    },
});
