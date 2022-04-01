/** @format */
import Error from "next/error";
import Link from "next/link";

import { query as q, Client } from "faunadb";
import { formatFaunaDoc, formatFaunaDocs } from "../../utils/Fauna";

import UserList from "./../../components/lists/UserList";
import PrimaryTitle from "../../components/PrimaryTitle";
import SecondaryTitle from "../../components/SecondaryTitle";

export default function Followers({ profile, errorCode, errorMessage }) {
	if (errorCode) {
		return <Error statusCode={errorCode} title={errorMessage} />;
	}
	return (
		<>
			<PrimaryTitle>
				<Link href={`/${profile.username}`}>
					<a className='hover:underline'>{profile.name}</a>
				</Link>
			</PrimaryTitle>
			<SecondaryTitle>{profile?.followerCount} seguidores</SecondaryTitle>
			<UserList users={profile?.followers} />
		</>
	);
}

export async function getServerSideProps(ctx) {
	const { username } = ctx.query;

	const client = new Client({
		secret: process.env.FAUNA_SECRET,
		domain: process.env.FAUNA_DOMAIN,
	});

	let errorMessage, errorCode;

	const profile = await client
		.query(q.Call(q.Function("getProfileByUsername"), username))
		.then((doc) => formatFaunaDoc(doc))
		.catch((err) => {
			console.log(err);
			errorMessage = err.requestResult.responseContent.errors[0].cause[0].code;
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

	const followerCount = await client
		.query(q.Count(q.Match(q.Index("followers_by_followee"), profile.owner)))
		.catch((error) => {
			errorCode = error.requestResult.statusCode;
			errorMessage = error.description;
		});

	if (errorCode) {
		return { props: { errorCode, errorMessage } };
	}

	const followers = await client
		.query(
			q.Map(
				q.Paginate(q.Match(q.Index("followers_by_followee"), profile.owner)),
				q.Lambda(["owner"], q.Call(q.Function("getProfile"), q.Var("owner")))
			)
		)
		.then((res) => formatFaunaDocs(res.data))
		.catch((err) => {
			console.log("err", err);
			return null;
		});

	if (errorCode) {
		return { props: { errorCode, errorMessage } };
	}

	return {
		props: {
			profile: {
				...profile,
				followerCount,
				followers,
			},
		},
	};
}
