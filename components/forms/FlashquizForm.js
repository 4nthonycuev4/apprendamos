/** @format */

import { useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import { useForm } from "react-hook-form";

import FlashcardList from "../lists/FlashcardList";
import TagsInput from "../TagsInput";

const defaultTags = [
	{ parsed: "hello_w0rld", raw: "Hello w0rld" },
	{ parsed: "bye", raw: "Bye " },
];

export default function FlashquizForm({ flashquiz }) {
	const [tags, setTags] = useState(flashquiz?.tags || defaultTags);

	const [sending, setSending] = useState(false);

	const [flashcards, setFlashcards] = useState(
		flashquiz?.flashcards || [
			{
				id: (Math.random() + 1).toString(36).substring(7),
				front: "hola",
				back: "mundo",
			},
		]
	);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			name: flashquiz?.name,
			tags: flashquiz?.tags.join(),
		},
	});

	const router = useRouter();

	function deleteEmptyFlashcards() {
		const items0 = Array.from(flashcards);
		const items1 = items0.filter(
			(item) => item.front.length > 0 && item.back.length > 0
		);
		setFlashcards(items1);
	}

	const createQuiz = async (data) => {
		try {
			const { name } = data;
			deleteEmptyFlashcards();
			const res = await fetch("/api/content/create", {
				method: "POST",
				body: JSON.stringify({
					data: { name, tags, flashcards },
					type: "flashquiz",
				}),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.catch((err) => console.error(err));

			router.push(
				`/@/${res.author.username}/flashquizzes/${res.content.ref.id}/`
			);
		} catch (err) {
			console.error(err);
		}
	};
	let flashquizId;
	if (flashquiz) {
		flashquizId = flashquiz.ref.id;
	}
	const updateQuiz = async (data) => {
		try {
			const { name, tags } = data;
			deleteEmptyFlashcards();
			const flashquiz = await fetch(`/api/flashquizzes/${flashquizId}/update`, {
				method: "PUT",
				body: JSON.stringify({ name, tags, flashcards }),
				headers: {
					"Content-Type": "application/json",
				},
			}).then((res) => res.json());

			router.push(
				`/@/${flashquiz.author.username}/flashquizzes/${flashquiz.ref.id}/`
			);
		} catch (err) {
			console.error(err);
		}
	};

	const deleteQuiz = async () => {
		setSending(true);
		const q = await fetch("/api/content/create", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		}).then((res) => res.json());

		setSending(false);
		router.push("/");
	};

	return (
		<form onSubmit={handleSubmit(flashquiz ? updateQuiz : createQuiz)}>
			<div className='mb-4'>
				<label
					className='block text-gray-800 text-sm font-bold mb-1'
					htmlFor='name'>
					Nombre
				</label>
				<input
					type='text'
					id='name'
					{...register("name", { required: true })}
					className='w-full border bg-white rounded px-3 py-2 outline-none text-gray-700'
					placeholder='Las teorías del origen de la vida'
				/>
				{errors.name && (
					<p className='font-bold text-red-900'>El nombre es obligatorio</p>
				)}
			</div>
			<TagsInput tags={tags} handleOnTagsChange={setTags} />

			<div className='mb-4'>
				<label
					className='block text-gray-800 text-sm font-bold mb-1 mr-5'
					htmlFor='flashcards'>
					Flashcards
				</label>
				<FlashcardList
					flashcards={flashcards}
					handleOnFlashcardsChange={setFlashcards}
				/>
			</div>

			<Link href={flashquiz ? `/q/${flashquiz.id}` : "/"}>
				<a className='mt-3 inline-block bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'>
					Cancelar
				</a>
			</Link>

			{flashquiz ? (
				<button
					disabled={isSubmitting}
					className='bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 disabled:bg-gray-200'
					type='submit'>
					Editar
				</button>
			) : (
				<button
					disabled={isSubmitting}
					className='bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 disabled:bg-gray-200'
					type='submit'>
					Crear
				</button>
			)}
			{flashquiz && (
				<button
					disabled={sending}
					onClick={deleteQuiz}
					className='bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 disabled:bg-gray-200'
					type='submit'>
					Eliminar
				</button>
			)}
		</form>
	);
}
