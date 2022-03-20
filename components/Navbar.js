/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

import ProfileMenu from "./ProfileMenu";
import Search from "./Search";

export default function Navbar() {
	const { user, isLoading } = useUser();

	return (
		<nav className='bg-white border-b sticky top-0 flex items-center justify-between px-10 h-16 z-40'>
			<Link href='/'>
				<a className='text-2xl mb-2 block text-center text-gray-800 font-bold'>
					<span>cuy</span>
					<span className='font-light'>zee</span>
				</a>
			</Link>

			<Search />

			{!isLoading && !user && (
				<Link href='/api/auth/login'>
					<a>
						<button className='bg-red-500 text-white font-bold rounded-md h-10 px-7 border'>
							Ingresar
						</button>
					</a>
				</Link>
			)}
			{!isLoading && user && <ProfileMenu profile={user.profile} />}
		</nav>
	);
}
