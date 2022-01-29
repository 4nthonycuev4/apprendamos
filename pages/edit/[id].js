/** @format */

import Head from "next/head";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

import { getTweetById } from "../../utils/Fauna";
import TweetForm from "../../components/TweetForm";

export default function Home({ tweet }) {
	const router = useRouter();

	const { user, isLoading } = useUser();

	if (isLoading) {
		return (
			<h1 className='text-red-100 text-2xl mb-4'>
				Espera un segundo, ¿tú publicaste esto?
			</h1>
		);
	} else if (user.sub !== tweet.data.userId) {
		router.push("/");
	}
	return (
		<div>
			<Head>
				<title>Update a Tweet</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='max-w-lg mx-auto'>
				<h1 className='text-red-100 text-2xl mb-4'>Update Tweet</h1>
				<TweetForm tweet={tweet} />
			</main>
		</div>
	);
}

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(context) {
		try {
			const id = context.params.id;

			const tweet = await getTweetById(id);

			return {
				props: { tweet },
			};
		} catch (error) {
			console.error(error);
			context.res.statusCode = 302;
			context.res.setHeader("Location", `/`);
			return { props: {} };
		}
	},
});
