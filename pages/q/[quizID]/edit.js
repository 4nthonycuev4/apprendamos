/** @format */

import Head from "next/head";
import Error from "next/error";

import {
	withPageAuthRequired,
	getAccessToken,
	getSession,
} from "@auth0/nextjs-auth0";

import { query as q, Client } from "faunadb";

import QuizForm from "../../../components/forms/QuizForm";

import { formatFaunaDoc } from "../../../utils/Fauna";

export default function EditQuiz({ quiz, errorCode }) {
	if (errorCode) {
		return <Error statusCode={errorCode} title='No autorizado' />;
	}

	return (
		<div>
			<Head>
				<title>Editar un Quiz</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='max-w-lg mx-auto'>
				<h1 className='text-gray-800 text-2xl mb-4'>Editar Quiz</h1>
				<QuizForm quiz={quiz} />
			</main>
		</div>
	);
}

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(context) {
		try {
			const { quizID } = context.params;
			const { accessToken } = await getAccessToken(context.req, context.res);

			const session = getSession(context.req);

			const client = new Client({
				secret: accessToken,
				domain: process.env.FAUNA_DOMAIN,
			});

			const quiz = await client
				.query(q.Get(q.Ref(q.Collection("quizzes"), quizID)))
				.then((res) => formatFaunaDoc(res));

			if (quiz.owner !== session.user.sub) {
				return { props: { errorCode: 403 } };
			}

			return {
				props: {
					quiz,
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
