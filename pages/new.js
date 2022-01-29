/** @format */

import Head from "next/head";
import TweetForm from "../components/TweetForm";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Home() {
	return (
		<div>
			<Head>
				<title>Crear un Tweet</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='max-w-lg mx-auto'>
				<h1 className='text-red-100 text-2xl mb-4'>Nuevo Tweet</h1>
				<TweetForm />
			</main>
		</div>
	);
}

export const getServerSideProps = withPageAuthRequired();
