/** @format */

import Head from "next/head";

import { query as q, Client } from "faunadb";

import { formatFaunaDocs } from "../../utils/Fauna";

import HeadTitle from "../../components/HeadTitle";
import BodyTitle from "../../components/BodyTitle";

import QuizList from "../../components/lists/QuizList";

export default function TagPage({ quizzes, quizCount, tag }) {
	return (
		<>
			<Head>
				<title>#{tag} quizzes</title>
			</Head>
			<HeadTitle>#{tag}</HeadTitle>
			<BodyTitle>{quizCount} quizzes</BodyTitle>
			<QuizList quizzes={quizzes} />
		</>
	);
}

export const getServerSideProps = async (ctx) => {
	try {
		const { tag } = ctx.query;

		const client = new Client({
			secret: process.env.FAUNA_SECRET,
			domain: process.env.FAUNA_DOMAIN,
		});

		const quizCount = await client.query(
			q.Count(q.Match(q.Index("quizzes_by_tag"), tag))
		);

		const quizzes = await client
			.query(
				q.Map(
					q.Paginate(
						q.Join(
							q.Match(q.Index("quizzes_by_tag"), tag),
							q.Index("quizzes_sort_by_ts_desc")
						)
					),
					q.Lambda(["ts", "ref"], q.Get(q.Var("ref")))
				)
			)
			.then((res) => formatFaunaDocs(res.data))
			.catch((err) => {
				console.log("err", err);
				return [];
			});
		return { props: { quizzes, quizCount, tag } };
	} catch (error) {}

	return {
		props: {
			errorCode: 400,
		},
	};
};
