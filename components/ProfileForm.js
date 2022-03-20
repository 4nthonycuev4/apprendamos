/** @format */

import React from "react";

import { useRouter } from "next/router";

import { useForm } from "react-hook-form";

export default function ProfileForm({ profile }) {
	const username0 = profile?.username;
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			name: profile?.name,
			username: profile?.username,
			bio: profile?.bio,
		},
	});

	const router = useRouter();

	const createProfile = async (data) => {
		const { name, bio, username } = data;
		try {
			await fetch("/api/profiles/create", {
				method: "POST",
				body: JSON.stringify({ name, bio, username }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			router.push("/api/auth/login");
		} catch (err) {
			console.error(err);
		}
	};

	const editProfile = async (data) => {
		const { name, bio, username } = data;
		try {
			await fetch(`/api/profiles/${username0}/edit`, {
				method: "PUT",
				body: JSON.stringify({ name, bio, username }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			router.push("/api/auth/login");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form onSubmit={handleSubmit(profile ? editProfile : createProfile)}>
			<div className='mb-4'>
				<label className='block  text-sm font-bold mb-1' htmlFor='name'>
					Nombre
				</label>
				<input
					type='text'
					id='name'
					{...register("name", { required: true })}
					className='w-full border bg-white rounded px-3 py-2 outline-none text-gray-700'
				/>
				{errors.title && (
					<p className='font-bold text-red-900'>El nombre es obligatorio</p>
				)}
			</div>

			<div className='mb-4'>
				<label className='block text-sm font-bold mb-1' htmlFor='bio'>
					Bio
				</label>
				<textarea
					{...register("bio", { required: true })}
					id='bio'
					rows='12'
					className='resize-none w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none'
					placeholder='Cuéntanos sobre ti'
				/>
				{errors.bio && (
					<p className='font-bold text-red-900'>La bio es obligatoria</p>
				)}
			</div>

			<div className='mb-4'>
				<label className='block  text-sm font-bold mb-1' htmlFor='username'>
					Nombre de Usuario
				</label>
				<input
					type='text'
					id='username'
					{...register("username", { required: true })}
					className='w-full border bg-white rounded px-3 py-2 outline-none text-gray-700'
				/>
				{errors.username && (
					<p className='font-bold text-red-900'>
						El nombre de usuario es obligatorio
					</p>
				)}
			</div>

			<button
				disabled={isSubmitting}
				className='bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
				type='submit'>
				Crear perfil
			</button>
		</form>
	);
}
