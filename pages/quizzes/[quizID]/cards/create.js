/** @format */

import Head from "next/head";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { useRouter } from "next/router";

import CardForm from "../../../../components/forms/CardForm";

export default function Home() {
	const router = useRouter();

	return (
		<div>
			<Head>
				<title>Crear una Carta</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<h1 className='text-gray-800  text-2xl mb-4'>Nueva Carta</h1>
			<CardForm quizID={router.query.quizID} />
		</div>
	);
}

export const getServerSideProps = withPageAuthRequired();
