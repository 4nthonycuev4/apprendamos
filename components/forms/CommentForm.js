/** @format */
import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";
import { PaperAirplaneIcon } from "@heroicons/react/solid";

export default function CommentForm({
	contentRef,
	comments,
	setViewerStats,
	setStats,
	setComments,
}) {
	const { user, isLoading } = useUser();

	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (error) {
			setTimeout(() => {
				setError(null);
			}, 5000);
		}
	}, [error]);

	const handleSubmit = () => {
		const rawComment = document.getElementById(
			`commentInput${contentRef.id}`
		).innerText;
		if (rawComment.length < 10) {
			setError("El comentario debe tener al menos 10 caracteres");
		} else if (rawComment.length >= 280) {
			setError("El comentario debe tener menos de 280 caracteres");
		} else {
			let coins = 0;
			let message = "";

			const regex = /(?<=\[)(.*?)(?=\])/;
			const matches = rawComment.match(regex);

			if (matches) {
				message = rawComment.replace(`[${matches[0]}]`, "").trim();
				coins = matches[0].replace(" ", "");
				coins = parseInt(coins);
				if (!coins) {
					coins = 0;
					message = rawComment;
				}
			} else {
				message = rawComment;
			}
			setIsSubmitting(true);
			document.getElementById(`commentInput${contentRef.id}`).innerText = "";
			createComment(message, coins);
			setIsSubmitting(false);
		}
	};

	const createComment = async (message, coins) => {
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
	};

	if (isLoading || !user) {
		return <div>Inicia sesión para comentar...</div>;
	}

	return (
		<div className='flex items-start space-x-4'>
			<div>
				<div className='h-16 w-16 relative'>
					<Image
						src={user.picture}
						alt='Picture of the author'
						layout='fill'
						objectFit='fill'
						className='rounded-full'
					/>
				</div>
			</div>
			<div className='flex w-full space-x-4 items-start'>
				<div className='w-full'>
					<div
						id={`commentInput${contentRef.id}`}
						type='text'
						className="w-full border-0 border-b-2 p-2 min-w-4 border-gray-200 focus:ring-0 empty:before:content-['Agrega_un_comentario...'] empty:before:text-gray-400"
						contentEditable={Boolean(user)}
					/>
					{error && <p className='text-red-500'>{error}</p>}
				</div>

				<button
					type='button'
					onClick={handleSubmit}
					disabled={isSubmitting || !user}
					className=' text-blue-500 disabled:text-gray-400'>
					<PaperAirplaneIcon className='w-5' />
				</button>
			</div>
		</div>
	);
}
