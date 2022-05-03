/** @format */

import Head from "next/head";

import FaunaClient from "../../../../../fauna";
import Post from "../../../../../components/items/Post";

export default function PostPage({ post, author, comments }) {
	return (
		<>
			<Head>
				<link
					rel='stylesheet'
					href='https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css'
					integrity='sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB'
					crossOrigin='anonymous'
				/>
				<script
					defer
					src='https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js'
					integrity='sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p'
					crossOrigin='anonymous'></script>
				<title>{`${author.name}'s post`}</title>
			</Head>

			<Post post={post} author={author} comments={comments} />
		</>
	);
}

export async function getServerSideProps(context) {
	const { postId } = context.query;
	const faunaClient = new FaunaClient();
	const res = await faunaClient.getSingleContentWithAuthor({
		collection: "Posts",
		id: postId,
	});

	return {
		props: {
			post: res.content,
			author: res.author,
			comments: res.comments,
		},
	};
}
