/** @format */

import Head from "next/head";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0";

import FlashquizForm from "./../../../../components/forms/FlashquizForm";

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
