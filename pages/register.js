/** @format */

import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import UserForm from "../components/forms/UserForm";

export default function Account({ user }) {
	const router = useRouter();

	useEffect(() => {
		if (user.ref) {
			router.push("/");
		}
	}, [user, router]);

	return (
		<div>
			<Head>
				<title>Regístrate</title>
			</Head>

			<main className='max-w-lg mx-auto'>
				<h1 className='text-2xl mb-4'>Regístrate</h1>
				<UserForm user={user} />
			</main>
		</div>
	);
}
export const getServerSideProps = withPageAuthRequired();
