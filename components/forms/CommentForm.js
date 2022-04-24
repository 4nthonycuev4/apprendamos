/** @format */
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useUser } from "@auth0/nextjs-auth0";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { useSWRConfig } from "swr";

export default function CommentForm({ contentRef }) {
	const { mutate } = useSWRConfig();

	const { user, error, isLoading } = useUser();
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			comment: "",
		},
	});

	const createComment = async (data) => {
		try {
			const { comment } = data;

			let coins = 0;
			let message = "";

			const regex = /(?<=\[)(.*?)(?=\])/;
			const matches = comment.match(regex);

			if (matches) {
				message = comment.replace(`[${matches[0]}]`, "").trim();
				coins = matches[0].replace(" ", "");
				coins = parseInt(coins);
				if (!coins) {
					coins = 0;
					message = comment;
				}
			} else {
				message = comment;
			}

			await fetch("/api/comments/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					ref: contentRef,
					message,
					coins,
				}),
			}).then((res) => res.json());
			reset();
			mutate(`/api/comments`);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form onSubmit={handleSubmit(createComment)}>
			<div className='flex w-full justify-between'>
				<input
					{...register("comment", { required: true })}
					type='text'
					name='comment'
					className='rounded-md w-10/12'
					placeholder={
						!isLoading && !error && user
							? "Escribe un comentario"
							: "Inicia sesión para comentar"
					}
				/>
				{!isLoading && !error && user && (
					<Image
						src={user.picture}
						alt='Picture of the user'
						width={40}
						height={40}
						className='rounded-full'
					/>
				)}
				<button
					type='submit'
					disabled={isSubmitting || !Boolean(!isLoading && !error && user)}>
					<PaperAirplaneIcon className='text-gray-500 w-5 disabled:text-blue-400' />
				</button>
			</div>
			{errors.comment && <p className='text-red-500'>Escribe un comentario</p>}
		</form>
	);
}
