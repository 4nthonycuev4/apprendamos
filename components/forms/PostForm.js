/** @format */
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export default function PostForm({ post }) {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			body: post?.bodyMd || "",
			tags: post?.tags || "",
		},
	});

	let postId;
	if (post) {
		postId = post.ref.id;
	}
	const updatePost = async (data) => {
		try {
			const { body, tags } = data;
			const post = await fetch(`/api/posts/${postId}/update`, {
				method: "PUT",
				body: JSON.stringify({ body, tags }),
				headers: {
					"Content-Type": "application/json",
				},
			}).then((res) => res.json());

			router.push(`/@/${post.author.username}/posts/${post.ref.id}/`);
		} catch (err) {
			console.error(err);
		}
	};

	const createPost = async (data) => {
		const { body, tags } = data;
		try {
			const post = await fetch("/api/posts/create", {
				method: "POST",
				body: JSON.stringify({ body, tags }),
				headers: {
					"Content-Type": "application/json",
				},
			}).then((res) => res.json());

			router.push(`/@/${post.author.username}/posts/${post.ref.id}`);
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<form onSubmit={handleSubmit(post ? updatePost : createPost)}>
			<label
				className='block text-gray-800  text-sm font-bold mb-1'
				htmlFor='body'>
				Cuerpo
			</label>
			<textarea
				{...register("body", { required: true })}
				type='text'
				id='body'
				rows='20'
				className='resize-none w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none'
				placeholder='hola mundo!'
			/>
			{errors.body && (
				<p className='font-bold text-red-900'>El cuerpo es obligatorio</p>
			)}
			<label
				htmlFor='tags'
				className='block text-gray-800  text-sm font-bold mb-1'>
				Tags separados por comas
			</label>
			<input
				{...register("tags", { required: true })}
				type='text'
				id='tags'
				className='w-full px-3 py-2 mb-2 text-gray-700 border rounded-lg focus:outline-none'
				placeholder='hola,Mundo'
			/>

			<button
				disabled={isSubmitting}
				className='bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 disabled:bg-gray-200'
				type='submit'>
				{post ? "Editar" : "Crear"}
			</button>
		</form>
	);
}
