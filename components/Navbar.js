/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Image from "next/image";
import { LoginIcon, LogoutIcon, PlusIcon } from "@heroicons/react/outline";

export default function Navbar() {
	const { user, isLoading } = useUser();

	return (
		<nav className='bg-white border-b sticky top-0 flex items-center justify-between max-w-2xl h-12 z-40 px-4'>
			<Link href='/'>
				<a className='text-2xl mb-2 block text-center text-gray-800 font-bold'>
					<span>cuy</span>
					<span className='font-light'>zee</span>
				</a>
			</Link>

			{!isLoading && !user && (
				<Link href='/api/auth/login'>
					<a>
						<button className='rounded-full border-2 hover:bg-gray-200 p-2'>
							<LoginIcon className='h-5 w-5 text-gray-600' />
						</button>
					</a>
				</Link>
			)}
			{!isLoading && user?.profile && (
				<div className='flex items-center w-32 justify-between'>
					<Link href={"/" + user.profile.username}>
						<a className='flex items-center'>
							<Image
								src={user.profile.picture}
								layout='fixed'
								width={40}
								height={40}
								className='rounded-full'
							/>
						</a>
					</Link>
					<Link href='/quizzes/create'>
						<a>
							<button className='rounded-full border-2  hover:bg-gray-200 p-2'>
								<PlusIcon className='h-5 w-5 text-gray-600' />
							</button>
						</a>
					</Link>
					<Link href='/api/auth/logout'>
						<a>
							<button className='rounded-full border-2 hover:bg-gray-200 p-2'>
								<LogoutIcon className='h-5 w-5 text-gray-600' />
							</button>
						</a>
					</Link>
				</div>
			)}
		</nav>
	);
}
