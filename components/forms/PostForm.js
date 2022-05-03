/** @format */
import { useState } from "react";
import { useRouter } from "next/router";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

import TagsInput from "../TagsInput";
import Tags from "../Tags";
import DeleteModal from "../DeleteModal";

const defaultTags = [{ parsed: "hello_w0rld", raw: "Hello w0rld" }];

async function MDtoHTML(md) {
	const html = await unified()
		.use(remarkParse)
		.use(remarkMath)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeKatex)
		.use(rehypeStringify)
		.process(md);

	return String(html);
}

export default function PostForm({ post, author }) {
	const router = useRouter();

	const [bodyHTML, setBodyHTML] = useState(post?.bodyHTML || null);
	const [bodyMD, setBodyMD] = useState(
		post?.bodyMD || `# Un buen título\nAlgo de texto ...`
	);
	const [tags, setTags] = useState(post?.tags || defaultTags);

	const [sending, setSending] = useState(false);
	const [previewing, setPreviewing] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const handlePreview = async () => {
		if (previewing) {
			setPreviewing(false);
		} else {
			const html = await MDtoHTML(bodyMD);
			setBodyHTML(html);
			setPreviewing(true);
		}
	};

	const updatePost = async () => {
		try {
			setSending(true);
			const res = await fetch("/api/content/update", {
				method: "PU",
				body: JSON.stringify({
					data: { bodyMD, bodyHTML, tags },
					ref: post.ref,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.catch((err) => console.error(err));

			if (res.updated) {
				router.push(`/@/${author.username}/posts/${post.ref.id}/`);
			} else {
				console.error("Error updating post");
			}
			setTimeout(() => setSending(false), 2000);
		} catch (err) {
			console.error(err);
		}
	};

	const createPost = async () => {
		try {
			setSending(true);
			const res = await fetch("/api/content/create", {
				method: "POST",
				body: JSON.stringify({
					data: { bodyMD, bodyHTML, tags },
					type: "post",
				}),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.catch((err) => console.error(err));

			router.push(`/@/${res.author.username}/posts/${res.content.ref.id}/`);
			setTimeout(() => setSending(false), 2000);
		} catch (err) {
			console.error(err);
		}
	};

	const deletePost = async () => {
		try {
			const res = await fetch("/api/content/delete", {
				method: "DELETE",

				body: JSON.stringify({
					ref: post.ref,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.catch((err) => console.error(err));

			if (res.deleted) {
				router.push(`/@/${author.username}/`);
			} else {
				console.error("Error eliminando post");
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleSubmit = () => {
		if (post) {
			updatePost();
		} else {
			createPost();
		}
	};

	if (previewing && bodyHTML) {
		return (
			<div className='rounded-lg border p-4'>
				<article
					className='prose'
					dangerouslySetInnerHTML={{ __html: bodyHTML }}
				/>
				<div className='h-2'></div>
				<Tags tags={tags} />
				<div className='flex space-x-2 mt-2 text-white '>
					<button
						type='button'
						onClick={handleSubmit}
						disabled={sending}
						className='py-2 px-4 w-40 rounded font-bold  bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 disabled:from-slate-400 disabled:to-slate-700 hover:disabled:from-slate-500 hover:disabled:to-gray-800'>
						{sending ? "Enviando..." : post ? "Actualizar" : "Crear"}
					</button>
					<button
						type='button'
						onClick={() => handlePreview()}
						className='py-2 px-4 w-40 rounded font-bold  bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-600 hover:to-green-600'>
						Seguir editando
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='rounded-lg border p-4'>
			<label className='block text-gray-800 text-sm font-bold mb-1'>
				Cuerpo (
				{bodyMD.length < 50
					? "escribe al menos 50 caracteres"
					: `${bodyMD.length}/2000`}
				)
			</label>
			<textarea
				type='text'
				id='body'
				rows='20'
				defaultValue={bodyMD}
				className='resize-none w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none'
				placeholder='Debe comenzar con un título (# Un buen título...)'
				onChange={(e) => setBodyMD(e.target.value)}
			/>

			<TagsInput tags={tags} handleOnTagsChange={setTags} />

			<div className='flex space-x-2 mt-2 text-white '>
				<button
					disabled={
						!bodyMD ||
						!bodyMD.startsWith("# ") ||
						bodyMD.length < 50 ||
						bodyMD.length > 2000
					}
					type='button'
					onClick={() => handlePreview()}
					className='py-2 px-4 w-40 rounded font-bold  bg-gradient-to-r from-sky-500 to-green-500 hover:from-sky-600 hover:to-green-600 disabled:from-slate-400 disabled:to-slate-700 hover:disabled:from-slate-500 hover:disabled:to-gray-800'>
					Preview
				</button>
				{post && (
					<button
						type='button'
						onClick={() => {
							setDeleteModalOpen(true);
						}}
						className='py-2 px-4 w-40 rounded font-bold  bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'>
						Eliminar
					</button>
				)}
			</div>
			{deleteModalOpen && (
				<DeleteModal
					onClose={() => {
						setDeleteModalOpen(false);
					}}
					onDelete={deletePost}
				/>
			)}
		</div>
	);
}
