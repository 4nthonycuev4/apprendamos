/** @format */

import Head from "next/head";
import useSWR from "swr";

import FaunaClient from "../../../../../fauna";

import Flashquiz from "../../../../../components/items/Flashquiz";
import Comments from "../../../../../components/lists/Comments";

export default function Quiz({ flashquiz, author, comments }) {
	return (
		<>
			<Head>
				<title>
					{author.name}: "{flashquiz.name}" flashquiz
				</title>
			</Head>
			<Flashquiz flashquiz={flashquiz} author={author} comments={comments} />
		</>
	);
}

export async function getServerSideProps(context) {
	try {
		const { flashquizId } = context.params;

		const faunaClient = new FaunaClient();

		const { content, author, comments } =
			await faunaClient.getSingleContentWithAuthor({
				collection: "Flashquizzes",
				id: flashquizId,
			});

		return { props: { flashquiz: content, author, comments } };
	} catch (error) {
		return { props: { errorCode: 500 } };
	}
}
