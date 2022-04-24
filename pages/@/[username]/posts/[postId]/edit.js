/** @format */

/** @format */

import Head from "next/head";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../../fauna";
import PostForm from "../../../../../components/forms/PostForm";

export default function EditPostPage({ post }) {
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
				<title>Editar Post</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='max-w-lg mx-auto'>
				<h1 className='text-gray-800  text-2xl mb-4'>Editar un post</h1>
				<PostForm post={post} />
			</main>
		</div>
	);
}

export async function getServerSideProps(context) {
	const { postId } = context.query;
	const faunaClient = new FaunaClient();
	const post = await faunaClient.getPost(postId);

	return {
		props: {
			post,
		},
	};
}
