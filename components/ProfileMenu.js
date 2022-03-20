/** @format */

import { Fragment } from "react";

import Link from "next/link";
import Image from "next/image";

import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function ProfileMenu({ profile }) {
	if (!profile?.name) {
		return <h1>Crear cuenta</h1>;
	}
	return (
		<div className='z-50'>
			<Menu as='div' className='relative inline-block text-left z-50'>
				<div className='z-50'>
					<Menu.Button className='inline-flex justify-center w-full  h-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 items-center z-50'>
						<Image
							src={profile.picture}
							width={30}
							height={30}
							className='rounded-full'
						/>
						<span className='ml-2 text-md font-bold'>
							{profile.name.split(" ")[0]}
						</span>
						<ChevronDownIcon
							className='-mr-1 ml-2 h-5 w-5'
							aria-hidden='true'
						/>
					</Menu.Button>
				</div>

				<Transition
					as={Fragment}
					enter='transition ease-out duration-100'
					enterFrom='transform opacity-0 scale-95'
					enterTo='transform opacity-100 scale-100'
					leave='transition ease-in duration-75'
					leaveFrom='transform opacity-100 scale-100'
					leaveTo='transform opacity-0 scale-95'>
					<Menu.Items className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50'>
						<div className='py-1 z-50'>
							<Menu.Item>
								{({ active }) => (
									<Link href={`/${profile.username}`}>
										<a
											className={classNames(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block px-4 py-2 text-sm"
											)}>
											Perfil
										</a>
									</Link>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<Link href={"/quizzes/create"}>
										<a
											className={classNames(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block px-4 py-2 text-sm"
											)}>
											Nuevo quiz
										</a>
									</Link>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<Link href={"/settings/profile"}>
										<a
											className={classNames(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block px-4 py-2 text-sm"
											)}>
											Editar perfil
										</a>
									</Link>
								)}
							</Menu.Item>
						</div>

						<div className='py-1 z-50'>
							<Menu.Item>
								{({ active }) => (
									<Link href='/api/auth/logout'>
										<a
											className={classNames(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block px-4 py-2 text-sm"
											)}>
											Salir
										</a>
									</Link>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
}
