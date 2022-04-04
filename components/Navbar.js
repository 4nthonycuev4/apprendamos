/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Image from "next/image";
import { LoginIcon, CollectionIcon, PlusIcon } from "@heroicons/react/outline";

export default function Navbar() {
	const { user, isLoading } = useUser();

	return (
		<nav
			className='
				px-4 py-1 top-0 sticky 
				flex justify-between items-center
				bg-white/30 backdrop-blur-md
				border-b'>
			<Link href='/'>
				<a className='flex text-center text-gray-800'>
					<CollectionIcon className='w-6 h-6' />
					<span className='pl-1 font-light'>cards</span>
					<span className='font-bold'>memo</span>
				</a>
			</Link>

			<div className='grid grid-cols-2 gap-2 items-center'>
				<Link href={!user ? "/api/auth/login" : "/q/create"}>
					<a>
						<button className='rounded-full hover:bg-gray-200 p-2'>
							<PlusIcon className='h-4 w-4 text-gray-600' />
						</button>
					</a>
				</Link>

				{!user ? (
					<Link href='/api/auth/login'>
						<a>
							<button className='rounded-full border-2 hover:bg-gray-200 p-2'>
								<LoginIcon className='h-5 w-5 text-gray-600' />
							</button>
						</a>
					</Link>
				) : (
					<Link href={"/p/" + user.profile.username}>
						<a className='flex items-center'>
							<Image
								src={user.profile.picture}
								layout='fixed'
								width={32}
								height={32}
								className='rounded-full'
							/>
						</a>
					</Link>
				)}
			</div>
		</nav>
	);
}
