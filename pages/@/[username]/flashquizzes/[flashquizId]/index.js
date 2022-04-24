/** @format */

import Head from "next/head";
import useSWR from "swr";

import FaunaClient from "../../../../../fauna";

import Flashquiz from "../../../../../components/items/Flashquiz";
import Comments from "../../../../../components/lists/Comments";

export default function Quiz({ flashquiz }) {
	return (
		<>
			<Head>
				<title>
					{flashquiz.author.name}: {flashquiz.title}
				</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Flashquiz flashquiz={flashquiz} />
			<Comments contentRef={flashquiz.ref} />
		</>
	);
}

export async function getServerSideProps(context) {
	try {
		const { flashquizId } = context.params;

		const client = new FaunaClient();

		const flashquiz = await client.getFlashquiz(flashquizId);

		return { props: { flashquiz } };
	} catch (error) {
		return { props: { errorCode: 500 } };
	}
}
