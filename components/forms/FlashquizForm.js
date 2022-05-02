/** @format */

import { useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import FlashcardList from "../lists/FlashcardList";
import TagsInput from "../TagsInput";

const defaultTags = [
	{ parsed: "hello_w0rld", raw: "Hello w0rld" },
	{ parsed: "bye", raw: "Bye " },
];

export default function FlashquizForm({ flashquiz }) {
	const [tags, setTags] = useState(flashquiz?.tags || defaultTags);
	const [name, setName] = useState(flashquiz?.name || "");
	const [flashcards, setFlashcards] = useState(
		flashquiz?.flashcards || [
			{
				id: (Math.random() + 1).toString(36).substring(7),
				front: "hola",
				back: "mundo",
			},
		]
	);

	const [error, setError] = useState(null);
	const [sending, setSending] = useState(false);

	const router = useRouter();

	function deleteEmptyFlashcards() {
		const items0 = Array.from(flashcards);
		const items1 = items0.filter(
			(item) => item.front.length > 0 && item.back.length > 0
		);
		setFlashcards(items1);
	}

	const createQuiz = async () => {
		try {
			setSending(true);
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
			setTimeout(() => setSending(false), 2000);
		} catch (err) {
			console.error(err);
		}
	};

	const updateQuiz = async () => {
		try {
			deleteEmptyFlashcards();
			const updatedFlashquiz = await fetch(
				`/api/flashquizzes/${flashquiz.ref.id}/update`,
				{
					method: "PUT",
					body: JSON.stringify({ name, tags, flashcards }),
					headers: {
						"Content-Type": "application/json",
					},
				}
			).then((res) => res.json());

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

	const handleSubmit = () => {
		if (flashquiz) {
			updateQuiz();
		} else {
			createQuiz();
		}
	};

	return (
		<div className='rounded-lg border p-4'>
			<div className='mb-4'>
				<label
					className='block text-gray-800 text-sm font-bold mb-1'
					htmlFor='name'>
					Nombre
				</label>
				<input
					type='text'
					id='name'
					onChange={(e) => setName(e.target.value)}
					defaultValue={name}
					className='w-full border bg-white rounded px-3 py-2 outline-none text-gray-700'
					placeholder='Las teorías del origen de la vida'
				/>
				{error && (
					<p className='font-bold text-red-900'>El nombre es obligatorio</p>
				)}
			</div>

			<div className='mb-4'>
				<label
					className='block text-gray-800 text-sm font-bold mb-1 mt-3'
					htmlFor='flashcards'>
					Flashcards ({flashcards.length}/30)
				</label>
				<FlashcardList
					flashcards={flashcards}
					handleOnFlashcardsChange={setFlashcards}
				/>
			</div>

			<TagsInput tags={tags} handleOnTagsChange={setTags} />

			<div className='flex space-x-2 mt-2 text-white '>
				<button
					onClick={handleSubmit}
					className='py-2 px-4 w-40 rounded font-bold bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 disabled:from-slate-400 disabled:to-slate-700 hover:disabled:from-slate-500 hover:disabled:to-gray-800'
					disabled={sending}
					type='button'>
					{sending ? "Enviando..." : flashquiz ? "Actualizar" : "Crear"}
				</button>

				{flashquiz && (
					<button
						onClick={deleteQuiz}
						className='bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 disabled:bg-gray-200'
						type='submit'>
						Eliminar
					</button>
				)}
			</div>
		</div>
	);
}
