/** @format */

import Head from "next/head";
import Error from "next/error";

import { query as q, Client } from "faunadb";

import { formatFaunaDoc, formatFaunaDocs } from "../../utils/Fauna";

import HeadTitle from "../../components/HeadTitle";
import BodyTitle from "../../components/BodyTitle";

import QuizList from "../../components/lists/QuizList";
import BigProfile from "../../components/items/BigProfile";

export default function Profile({
	profile,
	quizzes,
	quizCount,
	errorCode,
	errorMessage,
}) {
	if (errorCode) {
		return <Error statusCode={errorCode} title={errorMessage} />;
	}

	return (
		<>
			<Head>
				<title>
					{profile.name} (@{profile.username})
				</title>
			</Head>

			<HeadTitle>{profile.name}</HeadTitle>

			<BigProfile profile={profile} quizCount={quizCount} />
			<BodyTitle>{quizCount} quizzes</BodyTitle>
			<QuizList quizzes={quizzes} />
		</>
	);
}

export async function getServerSideProps(context) {
	try {
		const { username } = context.params;

		const client = new Client({
			secret: process.env.FAUNA_SECRET,
			domain: process.env.FAUNA_DOMAIN,
		});

		let errorCode = null;
		let errorMessage = null;

		const profile = await client
			.query(q.Call(q.Function("getProfileByUsername"), username))
			.then((doc) => formatFaunaDoc(doc))
			.catch((error) => {
				errorCode = error.requestResult.statusCode;
				errorMessage = error.description;
			});

		if (errorCode) {
			return { props: { errorCode, errorMessage } };
		}

		const quizzes = await client
			.query(
				q.Map(
					q.Paginate(
						q.Join(
							q.Match(q.Index("quizzes_by_owner"), profile.owner),
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

		const quizCount = await client
			.query(q.Count(q.Match(q.Index("quizzes_by_owner"), profile.owner)))
			.catch((error) => {
				errorCode = error.requestResult.statusCode;
				errorMessage = error.description;
			});

		if (errorCode) {
			return { props: { errorCode, errorMessage } };
		}

		return {
			props: {
				profile,
				quizzes,
				quizCount,
			},
		};
	} catch (error) {
		return { props: { errorCode: 500, errorMessage: error.message } };
	}
}
