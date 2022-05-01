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
			<div>
				<article
					className='prose'
					dangerouslySetInnerHTML={{ __html: bodyHTML }}
				/>
				<div className='h-2'></div>
				<Tags tags={tags} />
				<div className='flex space-x-2 mt-2 text-white '>
					<button
						type='submit'
						onClick={handleSubmit}
						className='py-2 px-4 rounded font-bold w-24 bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600'>
						{post ? "Actualizar" : "Crear"}
					</button>
					<button
						disabled={!bodyMD || !bodyMD.startsWith("# ")}
						type='button'
						onClick={() => handlePreview()}
						className='py-2 px-4 rounded font-bold w-40 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'>
						Seguir editando
					</button>
				</div>
			</div>
		);
	}

	return (
		<div>
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
					disabled={!bodyMD || !bodyMD.startsWith("# ")}
					type='button'
					onClick={() => handlePreview()}
					className={`py-2 px-4 rounded font-bold w-24 ${
						!bodyMD || !bodyMD.startsWith("# ")
							? "bg-slate-500"
							: "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
					}`}>
					Preview
				</button>
			</div>
		</div>
	);
}
