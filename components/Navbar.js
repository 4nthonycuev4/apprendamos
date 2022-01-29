/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";

export default function Navbar() {
	const { user, isLoading } = useUser();
	return (
		<nav>
			<Link href='/'>
				<a className='text-2xl mb-2 block text-center text-red-200'>
					TWITTER ROJO
				</a>
			</Link>
			<div className='flex space-x-3 justify-center mb-6 m-x-auto'>
				{!isLoading && !user && (
					<Link href='/api/auth/login'>
						<a className='text-red-100 hover:underline flex items-center'>
							Hola
							<AiOutlineLogin color='white' style={{ "margin-left": "5px" }} />
						</a>
					</Link>
				)}
				{!isLoading && user && (
					<>
						<Link href='/myTweets'>
							<a className='text-red-200 hover:underline'>Hola {user.name}</a>
						</Link>

						<Link href='/api/auth/logout'>
							<a className='text-red-200 hover:underline flex items-center'>
								Chao
								<AiOutlineLogout color='white' style={{ marginLeft: "5px" }} />
							</a>
						</Link>
					</>
				)}
			</div>
		</nav>
	);
}
