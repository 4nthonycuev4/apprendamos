/** @format */

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Dialog } from "@headlessui/react";

export default function CommentOptionsModal({ onClose = () => {} }) {
	let overlayRef = useRef();

	return (
		<Dialog
			static
			open={true}
			onClose={onClose}
			initialFocus={overlayRef}
			className='fixed inset-0 z-20 flex items-center justify-center'>
			<Dialog.Overlay ref={overlayRef} className='fixed inset-0 bg-white' />
			<div className='relative flex items-center justify-center w-full h-full'>
				<div className='grid grid-cols-1 gap-2'>
					{!error && !isLoading && user?.username === username && (
						<Link href={`/@/${username}/posts/${postId}/update`}>
							<button className='rounded-lg border mx-32 py-2 hover:bg-slate-100'>
								<a className='w-full'>Editar o eliminar</a>
							</button>
						</Link>
					)}

					<Link href={`/@/${username}/posts/${postId}/report`}>
						<button className='rounded-lg border mx-32 py-2 hover:bg-slate-100'>
							<a>Denunciar</a>
						</button>
					</Link>
					<button
						className='rounded-lg border mx-32 py-2 hover:bg-slate-100'
						onClick={() => router.back()}>
						Atrás
					</button>
				</div>
			</div>
		</Dialog>
	);
}
