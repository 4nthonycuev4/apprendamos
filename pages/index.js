/** @format */

import Head from "next/head";
import Tweet from "../components/Tweet";
import useSWR from "swr";

import Header from "../components/Header";

export default function Home() {
	const fetcher = (url) => fetch(url).then((r) => r.json());

	const { data: tweets } = useSWR("/api/tweets", fetcher);
	return (
		<div>
			<Head>
				<title>Home</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className=''>
				<Header
					title='Últimos tweets'
					subtitle="Bienvenido al twitter rojo. Puedes publicar lo que quieras, todo es anónimo. Nobody will know it's you..."
				/>
				{tweets &&
					tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)}
			</main>
		</div>
	);
}
