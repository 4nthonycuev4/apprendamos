/** @format */

import Head from "next/head";

import FaunaClient from "../../../../../fauna";

import Post from "../../../../../components/items/Post";
import Comments from "../../../../../components/lists/Comments";

export default function PostPage({ post }) {
	return (
		<>
			<Head>
				<link
					rel='stylesheet'
					href='https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css'
					integrity='sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB'
					crossorigin='anonymous'
				/>
				<script
					defer
					src='https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js'
					integrity='sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p'
					crossorigin='anonymous'></script>
			</Head>
			<Post post={post} />
			<Comments contentRef={post.ref} />
		</>
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
