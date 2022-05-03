/** @format */

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dialog } from "@headlessui/react";
import Comment from "./items/Comment";
import CommentForm from "./forms/CommentForm";

export default function CommentOptionsModal({
	onClose = () => {},
	comment,
	viewer,
}) {
	let overlayRef = useRef();
	const router = useRouter();

	const deleteComment = async () => {
		await fetch("/api/comments/delete", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				commentRef: comment.comment.ref,
			}),
		})
			.then((resx) => resx.json())
			.catch((err) => console.log(err));
		router.reload();
	};

	return (
		<Dialog
			static
			open={true}
			onClose={onClose}
			initialFocus={overlayRef}
			className='fixed inset-0 z-10 flex items-center justify-center'>
			<Dialog.Overlay ref={overlayRef} className='fixed inset-0 bg-white' />
			<div className='relative solid py-auto justify-center items-center w-full h-full space-y-4'>
				<div className='sm:w-1/2 w-full mx-auto px-4 mt-10 space-y-8'>
					{viewer?.username === comment.author.username ? (
						<CommentForm commentToUpdate={comment.comment} />
					) : (
						<Comment
							comment={comment.comment}
							author={comment.author}
							minimal={true}
						/>
					)}
					<div className='flex justify-center space-x-4'>
						<button
							className='rounded-lg border w-40 py-2 hover:bg-slate-100'
							onClick={onClose}>
							Atrás
						</button>
						{viewer?.username === comment.author.username && (
							<button
								className='rounded-lg border w-40 py-2 hover:bg-slate-100'
								onClick={deleteComment}>
								Eliminar
							</button>
						)}
					</div>
				</div>
			</div>
		</Dialog>
	);
}
