/** @format */

/** @format */

import Head from "next/head";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../../fauna";
import FlashquizForm from "../../../../../components/forms/FlashquizForm";

export default function EditFlashquizPage({ flashquiz, author }) {
	const router = useRouter();
	const { user, isLoading } = useUser();

	if (isLoading) return <div>Cargando...</div>;

	if ((!isLoading && !user) || user?.username !== author.username) {
		router.back();

		return <div>Cargando...</div>;
	}

	return (
		<>
			<Head>
				<title>Editar Flashquiz</title>
			</Head>

			<h1 className='text-gray-800  text-2xl mb-4'>Editar un flashquiz</h1>
			<FlashquizForm flashquiz={flashquiz} author={author} />
		</>
	);
}

export async function getServerSideProps(context) {
	const { flashquizId } = context.query;
	const faunaClient = new FaunaClient();

	const res = await faunaClient.getSingleContentWithAuthor(
		{
			collection: "Flashquizzes",
			id: flashquizId,
		},
		0
	);

	return {
		props: {
			flashquiz: res.content,
			author: res.author,
		},
	};
}
