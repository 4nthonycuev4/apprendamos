/** @format */
import { useRouter } from "next/router";

import FaunaClient from "../../fauna";
import Content from "../../components/lists/Content";
import Head from "next/head";

export default function TagPage({ content }) {
	const router = useRouter();
	const { tag } = router.query;

	return (
		<>
			<Head>
				<title>#{tag} posts & flashquizzes</title>
			</Head>
			<h1 className='text-2xl font-extrabold text-center mb-2'>
				Contenido con #{tag}
			</h1>
			{content && content.length > 0 ? (
				<Content content={content} minimal />
			) : (
				<div>
					<h1>Sin contenido :(</h1>
				</div>
			)}
		</>
	);
}

export async function getServerSideProps(context) {
	try {
		const { tag } = context.params;

		const client = new FaunaClient();

		const tag_parsed = tag.toLowerCase();

		const content = await client.getContentByTag(tag_parsed);

		return {
			props: {
				content,
			},
		};
	} catch (error) {
		return { props: { errorCode: 500, errorMessage: error.message } };
	}
}
