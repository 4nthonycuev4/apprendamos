import { Popover, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { Fragment } from "react";

export default function MDHelpPopover() {
    return (
        <div className="w-full max-w-sm px-4">
            <Popover className="relative">
                {() => (
                    <>
                        <Popover.Button>
                            <InformationCircleIcon className="text-gray-400 w-6 h-6 mt-2" />
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute z-10 mt-3 w-screen max-w-sm -translate-x-2/3 transform px-4 sm:px-0 lg:max-w-xl">
                                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="relative grid gap-4 bg-gray-700 text-gray-100 p-4 lg:grid-cols-2">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="border rounded py-1 px-4 hover:bg-gray-800">
                                                <h1 className="font-bold">
                                                    Cursiva
                                                </h1>
                                                <p>*texto*</p>
                                            </div>
                                            <div className="border rounded py-1 px-4 hover:bg-gray-800">
                                                <h1 className="font-bold">
                                                    Negritas
                                                </h1>
                                                <p>**texto**</p>
                                            </div>
                                            <div className="border rounded py-1 px-4 hover:bg-gray-800">
                                                <h1 className="font-bold">
                                                    Títulos
                                                </h1>
                                                <p className="whitespace-pre">{`# Título muy grande\n## Título un poco más pequeño`}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            <div className="border rounded py-1 px-4 hover:bg-gray-800">
                                                <h1 className="font-bold">
                                                    Ecuaciones
                                                </h1>
                                                <p className="whitespace-pre">
                                                    {`$$\nx^2 -3x + 5 = y\n$$`}
                                                </p>
                                            </div>
                                            <div className="border rounded py-1 px-4 hover:bg-gray-800">
                                                <h1 className="font-bold">
                                                    Scripts
                                                </h1>
                                                <p className="whitespace-pre">
                                                    {`~~~py\nprint("Hello world!")\n~~~`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-600 p-4">
                                        <Link href="/docs/markdown">
                                            <a>
                                                <span className="flex items-center">
                                                    <span className="font-bold text-gray-100">
                                                        Seguir aprendiendo la
                                                        sintaxis markdown
                                                    </span>
                                                </span>
                                                <span className="block text-sm text-gray-100">
                                                    Tablas, links, imágenes y
                                                    más...
                                                </span>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
}
