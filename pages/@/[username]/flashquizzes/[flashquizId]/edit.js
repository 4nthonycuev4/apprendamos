/** @format */

/** @format */

import Head from "next/head";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../../fauna";
import FlashquizForm from "../../../../../components/forms/FlashquizForm";

export default function EditFlashquizPage({ flashquiz }) {
	const { user, error, isLoading } = useUser();
	if (isLoading) return <div>Cargando...</div>;
	if (error) return <div>{error.message}</div>;
	if (!user) {
		const router = useRouter();
		router.push("/api/auth/login");

		return <div>Cargando...</div>;
	}
	return (
		<div>
			<Head>
				<title>Editar Flashquiz</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='max-w-lg mx-auto'>
				<h1 className='text-gray-800  text-2xl mb-4'>Editar un flashquiz</h1>
				<FlashquizForm flashquiz={flashquiz} />
			</main>
		</div>
	);
}

export async function getServerSideProps(context) {
	const { flashquizId } = context.query;
	const faunaClient = new FaunaClient();
	const flashquiz = await faunaClient.getFlashquiz(flashquizId);

	return {
		props: {
			flashquiz,
		},
	};
}
