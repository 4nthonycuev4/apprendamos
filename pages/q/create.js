/** @format */

import Head from "next/head";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import QuizForm from "../../components/forms/QuizForm";

export default function Home() {
	return (
		<div>
			<Head>
				<title>Crear un Test</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='max-w-lg mx-auto'>
				<h1 className='text-gray-800  text-2xl mb-4'>Nuevo Test</h1>
				<QuizForm />
			</main>
		</div>
	);
}

export const getServerSideProps = withPageAuthRequired();
