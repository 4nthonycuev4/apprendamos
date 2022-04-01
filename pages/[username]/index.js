/** @format */

import Head from "next/head";
import Error from "next/error";

import { query as q, Client } from "faunadb";

import { formatFaunaDoc, formatFaunaDocs } from "../../utils/Fauna";

import PrimaryTitle from "../../components/PrimaryTitle";
import SecondaryTitle from "../../components/SecondaryTitle";

import QuizList from "../../components/lists/QuizList";
import BigProfile from "../../components/items/BigProfile";

export default function Profile({ profile, errorCode, errorMessage }) {
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

			<PrimaryTitle>{profile.name}</PrimaryTitle>
			<BigProfile profile={profile} />
			<SecondaryTitle>{profile?.quizCount} quizzes</SecondaryTitle>
			<QuizList quizzes={profile?.quizzes} />
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
			.catch((err) => {
				console.log(err);
				errorMessage =
					err.requestResult.responseContent.errors[0].cause[0].code;
				if (errorMessage === "instance not found") {
					errorMessage = `No se encontró al usuario ${username}`;
					errorCode = 404;
				} else {
					errorMessage = "internal server error";
					errorCode = 400;
				}
				return null;
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

		const followerCount = await client
			.query(
				q.Count(
					q.Match(
						q.Index("followers_by_followee"),
						q.Select(
							["data", "owner"],
							q.Call(q.Function("getProfileByUsername"), username)
						)
					)
				)
			)
			.catch((error) => {
				errorCode = error.requestResult.statusCode;
				errorMessage = error.description;
			});

		if (errorCode) {
			return { props: { errorCode, errorMessage } };
		}

		const followingCount = await client
			.query(
				q.Count(
					q.Match(
						q.Index("followees_by_follower"),
						q.Select(
							["data", "owner"],
							q.Call(q.Function("getProfileByUsername"), username)
						)
					)
				)
			)
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
				profile: {
					...profile,
					followerCount,
					followingCount,
					quizCount,
					quizzes,
				},
			},
		};
	} catch (error) {
		return { props: { errorCode: 500, errorMessage: error.message } };
	}
}
