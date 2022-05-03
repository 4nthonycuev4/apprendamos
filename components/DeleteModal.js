/** @format */

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useRef } from "react";

const DeleteTimedown = ({ onCancel, onDelete }) => {
	const [time, setTime] = useState(5000);
	const [timerOn, setTimerOn] = useState(true);

	useEffect(() => {
		let interval = null;

		if (timerOn) {
			interval = setInterval(() => {
				setTime((prevTime) => prevTime - 1000);
			}, 1000);
		} else if (!timerOn) {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [timerOn]);

	useEffect(() => {
		if (time <= 0) {
			setTimerOn(false);
			onDelete();
		}
	}, [time]);

	return (
		<div className='text-center'>
			<h1 className='text-3xl font-bold mb-4'>
				{timerOn ? Math.floor(time / 1000) : "Eliminando..."}
			</h1>

			{timerOn && (
				<div className='text-white space-x-2'>
					<button
						onClick={onCancel}
						className='py-2 px-4 w-40 rounded font-bold  bg-gradient-to-r from-slate-400 to-slate-700 hover:from-slate-500 hover:to-slate-800'>
						Cancelar
					</button>
					<button
						onClick={() => {
							setTimerOn(false);
							onDelete();
						}}
						className='py-2 px-4 w-40 rounded font-bold  bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'>
						Eliminar
					</button>
				</div>
			)}
		</div>
	);
};

export default function DeleteModal({ onClose = () => {}, onDelete }) {
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
				<DeleteTimedown onCancel={onClose} onDelete={onDelete} />
			</div>
		</Dialog>
	);
}
