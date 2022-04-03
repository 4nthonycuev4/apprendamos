/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Image from "next/image";
import { LoginIcon, CollectionIcon } from "@heroicons/react/outline";

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
		</nav>
	);
}
