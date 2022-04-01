/** @format */

import Head from "next/head";

import { getSession } from "@auth0/nextjs-auth0";

import { query as q, Client } from "faunadb";

import useSWR from "swr";

import { formatFaunaDocs } from "../utils/Fauna";

import PrimaryTitle from "../components/PrimaryTitle";
import QuizList from "../components/lists/QuizList";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Home({ quizzes }) {
	return (
		<>
			<Head>
				<title>Bienvenido a cuyzee</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<PrimaryTitle>Bienvenid@ :D</PrimaryTitle>

			<QuizList quizzes={quizzes} />
		</>
	);
}

export async function getServerSideProps(ctx) {
	try {
		const client = new Client({
			secret: process.env.FAUNA_SECRET,
			domain: process.env.FAUNA_DOMAIN,
		});

		let errorCode, errorMessage;

		const quizzes = await client
			.query(
				q.Map(
					q.Paginate(
						q.Join(
							q.Match(q.Index("all_quizzes")),
							q.Index("quizzes_sort_by_ts_desc")
						)
					),
					q.Lambda(["ts", "ref"], q.Get(q.Var("ref")))
				)
			)
			.then((res) => formatFaunaDocs(res.data))
			.catch((error) => {
				errorCode = error.requestResult.statusCode;
				errorMessage = error.description;
			});

		if (errorCode) {
			return { props: { errorCode, errorMessage } };
		}

		return { props: { quizzes } };
	} catch (error) {
		return {
			props: {
				errorCode: 500,
			},
		};
	}
}
