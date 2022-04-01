/** @format */

import Image from "next/image";
import Link from "next/link";

export default function User({ user }) {
	return (
		<article
			id={user.id}
			className='border-y px-4 py-2 hover:bg-gray-100 flex items-center justify-start'>
			<Image
				src={user.picture}
				width={40}
				height={40}
				alt={user.username}
				className='rounded-full'
			/>
			<Link href={`/${user.username}`}>
				<a>
					<h1 className='text-md font-bold -mt-1 hover:underline ml-2'>
						{user.name}
					</h1>

					<h1 className='text-md font-thin -mt-1.5 ml-2'>@{user.username}</h1>
				</a>
			</Link>
		</article>
	);
}
