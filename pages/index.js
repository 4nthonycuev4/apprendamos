/** @format */

import Head from "next/head";
import Content from "../components/lists/Content";

import useSWR from "swr";

export default function Home() {
	const { data: content, error: contentError } = useSWR("/api/content");
	return (
		<>
			<Head>
				<title>Bienvenid@ a cardsmemo</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<h1>Bienvenid@ :D</h1>
			{content && !contentError && <Content content={content} />}
		</>
	);
}
