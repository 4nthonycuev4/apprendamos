/** @format */
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

import TagsInput from "../TagsInput";
import Tags from "../Tags";

const defaultTags = [
	{ parsed: "hello_w0rld", raw: "Hello w0rld" },
	{ parsed: "bye", raw: "Bye " },
];

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

export default function PostForm({ post }) {
	const [bodyHTML, setBodyHTML] = useState(post?.bodyHTML || null);
	const [bodyMD, setBodyMD] = useState(
		post?.bodyMD || `# Un buen título\nAlgo de texto ...`
	);
	const [tags, setTags] = useState(post?.tags || defaultTags);

	const [sending, setSending] = useState(false);

	const [previewing, setPreviewing] = useState(false);

	const handlePreview = async () => {
		if (previewing) {
			setPreviewing(false);
		} else {
			const html = await MDtoHTML(bodyMD);
			setBodyHTML(html);
			setPreviewing(true);
		}
	};

	const router = useRouter();

	const updatePost = async () => {
		try {
			const res = await fetch(`/api/posts/${post.ref.id}/update`, {
				method: "PUT",
				body: JSON.stringify({ body, tags }),
				headers: {
					"Content-Type": "application/json",
				},
			}).then((res) => res.json());

			router.push(`/@/${res.author.username}/posts/${res.content.ref.id}/`);
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
						className='py-2 px-4 w-40 rounded font-bold  bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'>
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
					className='py-2 px-4 w-40 rounded font-bold  bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:from-slate-400 disabled:to-slate-700 hover:disabled:from-slate-500 hover:disabled:to-gray-800'>
					Preview
				</button>
			</div>
		</div>
	);
}
