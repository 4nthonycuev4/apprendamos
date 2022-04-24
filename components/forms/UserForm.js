/** @format */

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function UserForm({ user }) {
	const [picture, setPicture] = useState(`/ru${getRandomInt(1, 8)}.jpg`);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			name: user?.name,
			username: user?.username,
			about: user?.about,
		},
	});

	const router = useRouter();

	const createUser = async (data) => {
		const { name, about, username } = data;
		try {
			await fetch("/api/users/create", {
				method: "POST",
				body: JSON.stringify({ name, about, username, picture }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			router.push("/api/auth/login");
		} catch (err) {
			console.error(err);
		}
	};

	const updateUser = async (data) => {
		const { name, about, username } = data;
		try {
			const user = await fetch(`/api/viewer/update`, {
				method: "PUT",
				body: JSON.stringify({ name, about, username, picture }),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.catch((err) => console.error(err));

			if (user) return router.push("/api/auth/login");
		} catch (err) {
			console.error(err);
		}
	};

	const handleImageUpload = async (x) => {
		const { files } = x.target;
		const file = files[0];
		if (file) {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", "uploads");

			const data = await fetch(
				"https://api.cloudinary.com/v1_1/cardsmemo/image/upload",
				{
					method: "POST",
					body: formData,
				}
			).then((res) => res.json());
			setPicture(data.secure_url);
		}
	};

	return (
		<form onSubmit={handleSubmit(user?.ref ? updateUser : createUser)}>
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
				<label className='block text-sm font-bold mb-1' htmlFor='about'>
					Acerca de ti...
				</label>
				<textarea
					{...register("about", { required: true })}
					id='about'
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

			<div>
				<label className='block text-sm font-bold mb-1' htmlFor='picture'>
					Foto de perfil
				</label>
				<input
					type='file'
					name='picture'
					onChange={(e) => handleImageUpload(e)}
				/>
				<br />
				<Image
					src={picture}
					alt='User picture'
					width={100}
					height={100}
					className='rounded-full'
				/>

				<br />
				<button
					type='button'
					className='bg-green-100 rounded-full px-4 mb-4'
					onClick={() => setPicture(`/ru${getRandomInt(1, 8)}.jpg`)}>
					Avatar aleatorio
				</button>
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
