/** @format */

import { useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import { useForm } from "react-hook-form";

export default function QuizForm({ quiz }) {
	const [sending, setSending] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			title: quiz?.title,
			tags: quiz?.tags.join(),
			about: quiz?.about,
		},
	});

	const router = useRouter();

	const createQuiz = async (data) => {
		const { title, tags, about } = data;
		try {
			const quiz = await fetch("/api/quizzes/create", {
				method: "POST",
				body: JSON.stringify({ title, tags, about }),
				headers: {
					"Content-Type": "application/json",
				},
			}).then((res) => res.json());

			!quiz.error && router.push(`/quizzes/${quiz.id}`);
		} catch (err) {
			console.error(err);
		}
	};

	const updateQuiz = async (data) => {
		const { title, tags, about } = data;

		console.log("data", data);

		try {
			const q = await fetch(`/api/quizzes/${quiz.id}/edit`, {
				method: "PUT",
				body: JSON.stringify({ title, tags, about }),
				headers: {
					"Content-Type": "application/json",
				},
			}).then((res) => res.json());
			router.push(`/quizzes/${quiz.id}`);
		} catch (err) {
			console.error(err);
		}
	};

	const deleteQuiz = async () => {
		setSending(true);
		const q = await fetch(`/api/quizzes/${quiz.id}/delete`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		}).then((res) => res.json());

		setSending(false);
		router.push("/");
	};

	return (
		<form onSubmit={handleSubmit(quiz ? updateQuiz : createQuiz)}>
			<div className='mb-4'>
				<label
					className='block text-gray-800 text-sm font-bold mb-1'
					htmlFor='title'>
					Título
				</label>
				<input
					type='text'
					id='title'
					{...register("title", { required: true })}
					className='w-full border bg-white rounded px-3 py-2 outline-none text-gray-700'
					placeholder="Ej: 'Las teorías del origen de la vida'"
				/>
				{errors.title && (
					<p className='font-bold text-red-900'>El título es obligatorio</p>
				)}
			</div>
			<div className='mb-4'>
				<label
					className='block text-gray-800  text-sm font-bold mb-1 mr-5'
					htmlFor='tags'>
					Tags separados por comas
				</label>
				<input
					type='text'
					id='tags'
					{...register("tags")}
					className='w-full border bg-white rounded px-3 py-2 outline-none text-gray-700'
					placeholder="Ej: 'Biologia, Historia, Filosofia, Creacion'"
				/>
			</div>
			<div className='mb-4'>
				<label
					className='block text-gray-800  text-sm font-bold mb-1'
					htmlFor='about'>
					Descripción
				</label>
				<textarea
					{...register("about", { required: true })}
					type='text'
					id='about'
					rows='12'
					className='resize-none w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none'
					placeholder='¿De qué se trata tu test? ¿Qué aprenderemos?...'
				/>
				{errors.about && (
					<p className='font-bold text-red-900'>
						La descripción es obligatoria
					</p>
				)}
			</div>
			<Link href={quiz ? `/q/${quiz.id}` : "/"}>
				<a className='mt-3 inline-block bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'>
					Cancelar
				</a>
			</Link>

			{quiz ? (
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
			{quiz && (
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
