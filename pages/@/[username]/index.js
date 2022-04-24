/** @format */

import Head from "next/head";
import Error from "next/error";

import FaunaClient from "../../../fauna";

import BigProfile from "../../../components/items/BigProfile";
import Content from "../../../components/lists/Content";

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
			<BigProfile profile={profile} />
			<Content
				content={profile.content}
				author={{ ...profile, content: null }}
			/>
		</>
	);
}

export async function getServerSideProps(context) {
	try {
		const { username } = context.params;

		const client = new FaunaClient();

		const profile = await client.getUserWithContent(username);

		return {
			props: {
				profile,
			},
		};
	} catch (error) {
		return { props: { errorCode: 500, errorMessage: error.message } };
	}
}
