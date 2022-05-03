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
				<link
					rel='stylesheet'
					href='https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css'
					integrity='sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB'
					crossOrigin='anonymous'
				/>
				<script
					defer
					src='https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js'
					integrity='sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p'
					crossOrigin='anonymous'></script>
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
