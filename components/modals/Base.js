import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function BaseModal({ title, children, isOpen, setIsOpen }) {
    const handleClose = () => setIsOpen(false)

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto h-screen w-screen">
                    <div className="h-full flex items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className="
                                flex flex-col
                                w-full sm:w-3/4 md:w-1/2 xl:w-1/3
                                h-full sm:h-3/4
                                transform overflow-hidden rounded-2xl dark:bg-gray-800 dark:text-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className='h-12 flex items-start'>
                                    <Dialog.Title
                                        as="h1"
                                        className="text-xl font-bold"
                                    >
                                        {title}
                                    </Dialog.Title>
                                </div>
                                <div className='flex flex-col h-14 grow overflow-y-scroll scrollbar-dark'>
                                    {children}
                                </div>

                                <div className="h-12 flex items-end justify-end">
                                    <button
                                        type="button"
                                        className="rounded-md border bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
                                        onClick={handleClose}
                                    >
                                        Entendido
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
