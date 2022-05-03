/** @format */

import Head from "next/head";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import FlashquizForm from "./../../../../components/forms/FlashquizForm";

export default function Home() {
	return (
		<>
			<Head>
				<title>Crear un Flashquiz</title>
			</Head>
			<h1 className='text-2xl font-extrabold text-center'>
				Crear un flashquiz
			</h1>
			<FlashquizForm />
		</>
	);
}

export const getServerSideProps = withPageAuthRequired();
