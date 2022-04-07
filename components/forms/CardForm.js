/** @format */
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export default function EditCard({ card, quizID }) {
	const [frontLength, setFrontLength] = useState(card?.front.length || 0);
	const [backLength, setBackLength] = useState(card?.back.length || 0);

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm({
		defaultValues: {
			front: card?.front,
			back: card?.back,
		},
	});

	const router = useRouter();

	const createCard = async ({ front, back }) => {
		await fetch("/api/cards/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ front, back, quizID }),
		})
			.then((res) => res.json())
			.then(() => {
				router.push(`/q/${quizID}`);
			})
			.catch(console.error);
		await new Promise((resolve) => setTimeout(resolve, 2000));
	};

	const editCard = async ({ front, back }) => {
		await fetch(`/api/cards/${card.id}/edit`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ front, back }),
		})
			.then((res) => res.json())
			.then(() => {
				router.push(`/q/${card.quiz}`);
			})
			.catch(console.error);
		await new Promise((resolve) => setTimeout(resolve, 2000));
	};

	const deleteCard = async () => {
		await fetch(`/api/cards/${card.id}/delete`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then(() => {
				router.push(`/q/${card.quiz}`);
			})
			.catch(console.error);
		await new Promise((resolve) => setTimeout(resolve, 2000));
	};

	return (
		<form onSubmit={handleSubmit(card ? editCard : createCard)}>
			<div className='px-4 '>
				<h1>Editar Carta</h1>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<div>
						<textarea
							{...register("front", { required: true, maxLength: 240 })}
							rows={10}
							onChange={(e) => setFrontLength(e.target.value.length)}
							className='caret-red-500 bg-red-200 outline-red-500 rounded-md resize-none p-4 w-full text-center '
						/>
						<h1
							className={
								frontLength > 240 || frontLength === 0 ? "text-red-600" : ""
							}>
							<span>Caracteres: </span>
							<span>{frontLength}</span>
							<span>/240</span>
						</h1>
						{errors.front?.type === "required" && (
							<p className='text-red-600'>Este campo es requerido.</p>
						)}
						{errors.front?.type === "maxLength" && (
							<p className='text-red-600'>Superaste el límite de caracteres.</p>
						)}
					</div>
					<div>
						<textarea
							{...register("back", { required: true, maxLength: 240 })}
							rows={10}
							onChange={(e) => setBackLength(e.target.value.length)}
							className='caret-blue-500 bg-blue-200 outline-blue-500 rounded-md w-full resize-none p-4 text-center font-bold'
						/>
						<h1
							className={
								backLength > 240 || backLength === 0 ? "text-red-600" : ""
							}>
							<span>Caracteres: </span>
							<span>{backLength}</span>
							<span>/240</span>
						</h1>
						{errors.back?.type === "required" && (
							<p className='text-red-600'>Este campo es requerido.</p>
						)}
						{errors.back?.type === "maxLength" && (
							<p className='text-red-600'>Superaste el límite de caracteres.</p>
						)}
					</div>
				</div>
				<Link href={card ? `/q/${card.quiz}` : `/q/${quizID}`}>
					<a className='mt-3 inline-block bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'>
						Cancelar
					</a>
				</Link>

				{card ? (
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
				{card && (
					<button
						onClick={() => deleteCard()}
						className='bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 disabled:bg-gray-200'>
						Eliminar
					</button>
				)}
			</div>
		</form>
	);
}
