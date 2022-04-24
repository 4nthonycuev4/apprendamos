/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Image from "next/image";
import { LoginIcon, CollectionIcon, PlusIcon } from "@heroicons/react/outline";

export default function Navbar() {
	const { user, error, isLoading } = useUser();

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
			{!error && !isLoading && user?.ref ? (
				<div className='flex space-x-2 items-center'>
					<button className='rounded-full hover:bg-gray-200 p-2'>
						<Link href={`/@/${user.username}/create`}>
							<a>
								<PlusIcon className='h-4 w-4 text-gray-600' />
							</a>
						</Link>
					</button>
					<Link href={`/@/${user.username}`}>
						<a className='flex items-center'>
							<Image
								src={user.picture}
								width={40}
								height={40}
								className='rounded-full'
							/>
						</a>
					</Link>
				</div>
			) : (
				<Link href='/api/auth/login'>
					<a>
						<button className='rounded-full border-2 hover:bg-gray-200 p-2'>
							<LoginIcon className='h-5 w-5 text-gray-600' />
						</button>
					</a>
				</Link>
			)}
		</nav>
	);
}
