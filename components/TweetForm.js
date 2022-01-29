/** @format */

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { useState } from "react";

import Link from "next/link";
export default function TweetForm({ tweet }) {
	const [sending, setSending] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: tweet?.data.title,
			topic: tweet?.data.topic,
			body: tweet?.data.body,
		},
	});

	const router = useRouter();

	const createTweet = async (data) => {
		const { title, topic, body } = data;
		setSending(true);
		try {
			await fetch("/api/createTweet", {
				method: "POST",
				body: JSON.stringify({ title, topic, body }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			router.push("/");
		} catch (err) {
			console.error(err);
		}
	};

	const updateTweet = async (data) => {
		const { title, topic, body } = data;

		const id = tweet.id;
		setSending(true);
		try {
			await fetch("/api/updateTweet", {
				method: "PUT",
				body: JSON.stringify({ id, title, topic, body }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			router.push("/");
		} catch (err) {
			console.error(err);
		}
	};

	const deleteTweet = async () => {
		setSending(true);
		try {
			await fetch("/api/deleteTweet", {
				method: "DELETE",
				body: JSON.stringify({ id: tweet.id }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			router.push("/");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form onSubmit={handleSubmit(tweet ? updateTweet : createTweet)}>
			<div className='mb-4'>
				<label
					className='block text-red-100 text-sm font-bold mb-1'
					htmlFor='title'>
					Título
				</label>
				<input
					type='text'
					id='title'
					{...register("title", { required: true })}
					className='w-full border bg-white rounded px-3 py-2 outline-none text-gray-700'
				/>
				{errors.title && (
					<p className='font-bold text-red-900'>El título es obligatorio</p>
				)}
			</div>
			<div className='mb-4'>
				<label
					className='block text-red-100 text-sm font-bold mb-1 mr-5'
					htmlFor='topic'>
					Tema
				</label>
				<input
					list='list'
					name='topic'
					id='topic'
					className='border bg-white rounded px-3 py-2 outline-none text-gray-700 uppercase'
					{...register("topic", { required: true })}
				/>
				<datalist id='list'>
					<option className='py-1' value='AMOR'>
						AMOR
					</option>
					<option className='py-1' value='DESAMOR'>
						DESAMOR
					</option>
					<option className='py-1' value='PERRITOS'>
						PERRITOS
					</option>
				</datalist>
				{errors.topic && (
					<p className='font-bold text-red-900'>El tema es obligatorio</p>
				)}
			</div>
			<div className='mb-4'>
				<label
					className='block text-red-100 text-sm font-bold mb-1'
					htmlFor='body'>
					Cuerpo
				</label>
				<textarea
					{...register("body", { required: true })}
					id='code'
					rows='12'
					className='resize-none w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none'
					placeholder='p. ej. A q edad se supera Yellow de Coldplay ?'
				/>
				{errors.body && (
					<p className='font-bold text-red-900'>El cuerpo es obligatorio</p>
				)}
			</div>
			<Link href='/'>
				<a className='mt-3 inline-block bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'>
					Cancel
				</a>
			</Link>
			<button
				disabled={sending}
				className='bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
				type='submit'>
				Save
			</button>
			{tweet && (
				<button
					disabled={sending}
					className='bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
					onClick={deleteTweet}>
					Delete
				</button>
			)}
		</form>
	);
}
