/** @format */

import { Fragment, useRef } from "react";

import { useRouter } from "next/router";

import { useForm } from "react-hook-form";

import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/outline";

export default function NewCardModal({ open, setOpen }) {
	const router = useRouter();

	const { quizID } = router.query;

	const cancelButtonRef = useRef(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm({
		defaultValues: {
			front: "",
			back: "",
		},
	});

	const createCard = async (data) => {
		const { front, back } = data;
		try {
			await fetch(`/api/quizzes/${quizID}/cards/create`, {
				method: "POST",
				body: JSON.stringify({ front, back }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			setOpen(false);
			reset();
			router.push(`/quizzes/${quizID}`);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as='div'
				className='fixed z-10 inset-0 overflow-y-auto'
				initialFocus={cancelButtonRef}
				onClose={setOpen}>
				<form onSubmit={handleSubmit(createCard)}>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'>
							<Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
						</Transition.Child>

						<span
							className='hidden sm:inline-block sm:align-middle sm:h-screen'
							aria-hidden='true'>
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
							<div className='relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
								<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
									<div className='sm:flex sm:items-center'>
										<div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10'>
											<PlusIcon
												className='h-6 w-6 text-blue-600'
												aria-hidden='true'
											/>
										</div>
										<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
											<Dialog.Title
												as='h3'
												className='text-lg leading-6 font-medium text-gray-900'>
												Añadir tarjeta
											</Dialog.Title>
										</div>
									</div>
								</div>
								<div className='mx-5 mb-3 grid grid-cols-1 gap-5 sm:grid-cols-2'>
									<div>
										<label
											htmlFor='front'
											className='block text-sm font-medium text-gray-700'>
											Cara
										</label>
										<div className='mt-1'>
											<textarea
												id='front'
												name='front'
												rows={10}
												{...register("front", { required: true })}
												className='block p-2 mt-1 w-full
                                            rounded-md 
                                            shadow-sm 
                                            border
                                            border-gray-300  
                                            focus:border-2
                                            focus:border-indigo-500
                                            resize-none outline-none'
												placeholder='¿Qué es un agujero negro?'
											/>
										</div>
										<p className='mt-2 text-sm text-gray-500'>
											La pregunta o algo que te deba hacer recordar lo que está
											atrás...
										</p>
									</div>
									<div>
										<label
											htmlFor='back'
											className='block text-sm font-medium text-gray-700'>
											Sello
										</label>
										<div className='mt-1'>
											<textarea
												id='back'
												name='back'
												rows={10}
												{...register("back", { required: true })}
												className='block p-2 mt-1 w-full
                                            rounded-md 
                                            shadow-sm 
                                            border
                                            border-gray-300  
                                            focus:border-2
                                            focus:border-indigo-500
                                            resize-none outline-none'
												placeholder='Los agujeros negros son los restos fríos de antiguas estrellas, tan densas que ninguna partícula material, ni siquiera la luz, es capaz de escapar a su poderosa fuerza gravitatoria.'
												defaultValue={""}
											/>
										</div>
										<p className='mt-2 text-sm text-gray-500'>
											La respuesta :D
										</p>
									</div>
								</div>
								<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
									<button
										disabled={isSubmitting}
										type='submit'
										className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'>
										Añadir
									</button>
									<button
										type='button'
										className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
										onClick={() => setOpen(false)}
										ref={cancelButtonRef}>
										Cancelar
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</form>
			</Dialog>
		</Transition.Root>
	);
}
