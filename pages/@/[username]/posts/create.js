/** @format */
import Head from "next/head";
import PostForm from "./../../../../components/forms/PostForm";

export default function CreatePostPage() {
	return (
		<>
			<Head>
				<title>Create Post</title>
			</Head>
			<PostForm />
		</>
	);
}
