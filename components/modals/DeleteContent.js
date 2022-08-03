import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";

export default function DeleteContentModal({ isOpen, setIsOpen, contentId }) {
    const router = useRouter();
    const { user } = useUser();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleCancel = () => setIsOpen(false);
    const handleDelete = async () => {
        setIsOpen(false);
        setIsDeleting(true);
        const deleted = await fetch(`/api/${contentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .catch((err) => console.log(err));

        if (deleted?.status === "done") {
            router.push("/" + user.nickname);
        }

        setIsDeleting(false);
        setIsOpen(false);
        console.log("ok");
    };

    return (
        <>
            <Transition appear show={isDeleting} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setIsDeleting(false)}
                >
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

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Eliminando contenido
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Te recomendamos que guardes tu
                                            trabajo antes de eliminarlo.
                                        </p>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={handleCancel}
                >
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

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                    <div className="p-6 pb-0">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            ¿Estás seguro de que deseas eliminar
                                            este contenido?
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Una vez eliminado, no podrás
                                                recuperarlo.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex mt-4 px-6 py-2 bg-gray-100 items-center justify-end">
                                        <button
                                            type="button"
                                            className="justify-center rounded border border-transparent bg-white px-4 py-2 mr-2 text-sm font-semibold
                                             text-gray-800 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500
                                             focus-visible:ring-offset-2"
                                            onClick={handleCancel}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            className="justify-center rounded border border-transparent bg-red-500 px-4 py-2 text-sm font-semibold
                                             text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                                             focus-visible:ring-offset-2"
                                            onClick={handleDelete}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
