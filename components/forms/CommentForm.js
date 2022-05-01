/** @format */
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useUser } from "@auth0/nextjs-auth0";
import { PaperAirplaneIcon } from "@heroicons/react/solid";

export default function CommentForm({
	contentRef,
	comments,
	setViewerStats,
	setStats,
	setComments,
}) {
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

			const res = await fetch("/api/comments/create", {
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
			setViewerStats(res.viewerStats);
			setStats(res.stats);
			setComments(
				[{ comment: res.comment, author: res.author }].concat(comments)
			);

			reset();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form className='w-full' onSubmit={handleSubmit(createComment)}>
			<div className='flex space-x-2'>
				{!isLoading && !error && user && (
					<Image
						src={user.picture}
						alt='Picture of the user'
						width={50}
						height={50}
						className='rounded-full'
					/>
				)}
				<input
					{...register("comment", { required: true })}
					type='text'
					name='comment'
					disabled={!user}
					className='rounded-md w-3/4'
					placeholder={
						!isLoading && !error && user
							? "Escribe un comentario"
							: "Inicia sesión para comentar"
					}
				/>

				<button
					type='submit'
					disabled={isSubmitting || !user}
					className=' text-blue-500 disabled:text-gray-400'>
					<PaperAirplaneIcon className='w-5' />
				</button>
			</div>
			{errors.comment && <p className='text-red-500'>Escribe un comentario</p>}
		</form>
	);
}
