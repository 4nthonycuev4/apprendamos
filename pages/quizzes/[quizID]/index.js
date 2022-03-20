/** @format */

import Error from "next/error";
import Head from "next/head";

import { query as q, Client } from "faunadb";

import { useUser } from "@auth0/nextjs-auth0";

import { formatFaunaDoc, formatFaunaDocs } from "../../../utils/Fauna";

import HeadTitle from "../../../components/HeadTitle";
import BodyTitle from "../../../components/BodyTitle";
import BigQuiz from "../../../components/items/BigQuiz";
import CardList from "../../../components/lists/CardList";
import AddCardButton from "../../../components/buttons/AddCard";

export default function Quiz({
	quiz,
	profile,
	cards,
	errorCode,
	errorMessage,
}) {
	if (errorCode) {
		return <Error statusCode={errorCode} title={errorMessage} />;
	}

	const { user, isLoading } = useUser();

	return (
		<>
			<Head>
				<title>
					{profile.name}: {quiz.title}
				</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<HeadTitle>{quiz.title}</HeadTitle>
			<BigQuiz
				quiz={quiz}
				profile={profile}
				user={user}
				isLoading={isLoading}
			/>
			<BodyTitle>Cartas</BodyTitle>
			{!isLoading && user?.sub === quiz.owner && <AddCardButton />}
			<CardList cards={cards} />
		</>
	);
}

export async function getServerSideProps(context) {
	try {
		const { quizID } = context.params;

		const client = new Client({
			secret: process.env.FAUNA_SECRET,
			domain: process.env.FAUNA_DOMAIN,
		});

		let errorCode, errorMessage;

		const quiz = await client
			.query(q.Get(q.Ref(q.Collection("quizzes"), quizID)))
			.then((doc) => formatFaunaDoc(doc))
			.catch((error) => {
				errorCode = error.requestResult.statusCode;
				errorMessage = error.description;
			});

		if (errorCode) {
			return { props: { errorCode, errorMessage } };
		}

		const profile = await client
			.query(q.Call(q.Function("getProfile"), quiz.owner))
			.then((doc) => formatFaunaDoc(doc))
			.catch((error) => {
				errorCode = error.requestResult.statusCode;
				errorMessage = error.description;
			});

		if (errorCode) {
			return { props: { errorCode, errorMessage } };
		}

		const cards = await client
			.query(
				q.Map(
					q.Paginate(
						q.Match(
							q.Index("cards_by_quiz"),
							q.Ref(q.Collection("quizzes"), quizID)
						)
					),
					q.Lambda(["ref"], q.Get(q.Var("ref")))
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

		return { props: { quiz, profile, cards } };
	} catch (error) {
		return { props: { errorCode: 500 } };
	}
}
