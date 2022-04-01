/** @format */
import Head from "next/head";

import {
	withPageAuthRequired,
	getAccessToken,
	getSession,
} from "@auth0/nextjs-auth0";

import { query as q, Client } from "faunadb";

import { formatFaunaDoc } from "../../../../../utils/Fauna";

import CardForm from "../../../../../components/forms/CardForm";

export default function EditCard({ card }) {
	return (
		<>
			<Head>
				<title>Editar carta "{card.front}"</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<CardForm card={card} />
		</>
	);
}

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(context) {
		try {
			const { quizID, cardID } = context.params;
			const { accessToken } = await getAccessToken(context.req, context.res);

			const session = getSession(context.req);

			const client = new Client({
				secret: accessToken,
				domain: process.env.FAUNA_DOMAIN,
			});

			const card = await client
				.query(q.Get(q.Ref(q.Collection("cards"), cardID)))
				.then((res) => formatFaunaDoc(res));

			if (card.owner !== session.user.sub) {
				return { props: { errorCode: 403 } };
			}

			if (card.quiz !== quizID) {
				return { props: { errorCode: 404 } };
			}

			return {
				props: {
					card,
				},
			};
		} catch {
			return {
				props: {
					errorCode: 500,
				},
			};
		}
	},
});
