/** @format */

import Head from "next/head";
import { useUser } from "@auth0/nextjs-auth0";
import useSWR from "swr";

import Content from "../components/lists/Content";

export default function Home() {
	const { user, isLoading } = useUser();

	const getUrl = () =>
		user && user.username
			? `/api/content?username=${user.username}`
			: "/api/content";

	const { data: content } = useSWR(!isLoading ? getUrl() : null);

	if (isLoading || !content) {
		return <p>Loading...</p>;
	}

	return (
		<>
			<Head>
				<title>Cardsmemo || Flashcards & posts</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<h1 className='text-2xl font-extrabold text-center mb-2'>
				Bienvenid@ a cardsmemo
			</h1>

			<Content content={content} showComments minimal />
		</>
	);
}
