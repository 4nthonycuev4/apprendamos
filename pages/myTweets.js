/** @format */
import useSWR from "swr";
import Head from "next/head";

import Tweet from "../components/Tweet";
import Header from "../components/Header";

export default function MyTweets() {
	const fetcher = (url) => fetch(url).then((r) => r.json());

	const { data: tweets } = useSWR("/api/myTweets", fetcher);
	return (
		<div>
			<Head>
				<title>Mis tweets</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className=''>
				<Header title='Mis tweets' />
				{tweets &&
					tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)}
			</main>
		</div>
	);
}
