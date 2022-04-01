/** @format */

import { Fragment, useRef } from "react";

import { Dialog, Transition } from "@headlessui/react";

import UserList from "./lists/UserList";

export default function UserListModal({ open, setOpen, users, title }) {
	const cancelButtonRef = useRef(null);

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as='div'
				className='fixed z-10 inset-0 overflow-y-auto'
				initialFocus={cancelButtonRef}
				onClose={setOpen}>
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
								<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
									<Dialog.Title
										as='h3'
										className='text-xl leading-6 font-medium text-gray-900'>
										{title}
									</Dialog.Title>
								</div>
							</div>
							<div className='mx-10'>
								<UserList users={users} setOpen={setOpen} />
							</div>
							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
									onClick={() => setOpen(false)}
									ref={cancelButtonRef}>
									Cerrar
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
