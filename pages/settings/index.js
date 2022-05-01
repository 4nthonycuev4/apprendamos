/** @format */

import Head from "next/head";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import UserForm from "../../components/forms/UserForm";

export default function Account({ user }) {
	return (
		<>
			<Head>
				<title>Edita tu Perfil</title>
			</Head>

			<h1 className=' text-2xl mb-4'>Edita tu Perfil</h1>
			<UserForm user={user} />
		</>
	);
}

export const getServerSideProps = withPageAuthRequired({
	redirectTo: "/",
});
