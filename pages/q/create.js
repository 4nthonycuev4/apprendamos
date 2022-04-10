/** @format */

import Head from "next/head";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0";

import QuizForm from "../../components/forms/QuizForm";

export default function Home() {
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
