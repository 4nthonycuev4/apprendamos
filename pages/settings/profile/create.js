/** @format */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import ProfileForm from "../../../components/ProfileForm";

export default function Account({ user }) {
	const [u, setU] = useState(user);

	const router = useRouter();

	useEffect(() => {
		const a = () => {
			if (u.registered) {
				router.push("/");
			}
		};
		a();
	}, []);

	return (
		<div>
			<Head>
				<title>Crea tu Perfil</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='max-w-lg mx-auto'>
				<h1 className='text-red-100 text-2xl mb-4'>Crear tu Perfil</h1>
				<ProfileForm />
			</main>
		</div>
	);
}

export const getServerSideProps = withPageAuthRequired();
