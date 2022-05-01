/** @format */

import Head from "next/head";
import Error from "next/error";

import FaunaClient from "../../../fauna";

import BigProfile from "../../../components/items/BigProfile";
import Content from "../../../components/lists/Content";

export default function Profile({ user, content, errorCode, errorMessage }) {
	if (errorCode) {
		return <Error statusCode={errorCode} title={errorMessage} />;
	}

	return (
		<>
			<Head>
				<title>
					{user.name} (@{user.username})
				</title>
			</Head>
			<BigProfile profile={user} />
			<Content content={content} author={user} minimal={true} />
		</>
	);
}

export async function getServerSideProps(context) {
	try {
		const { username } = context.params;

		const client = new FaunaClient();

		const { user, content } = await client.getUserWithContent(username);

		return {
			props: {
				user,
				content,
			},
		};
	} catch (error) {
		return { props: { errorCode: 500, errorMessage: error.message } };
	}
}
