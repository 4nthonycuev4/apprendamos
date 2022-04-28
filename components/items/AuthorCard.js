/** @format */

import Image from "next/image";
import Link from "next/link";

export default function AuthorCard({ author }) {
	return (
		<div className='flex space-x-4 items-center'>
			<Image
				src={author.picture}
				alt='Picture of the user'
				width={75}
				height={75}
				className='rounded-full'
			/>
			<div className='text-left'>
				<Link href={`/@/${author.username}`}>
					<a className='hover:underline'>
						<h1 className='font-bold'>{author.name}</h1>
						<h1 className='font-normal'>@{author.username}</h1>
					</a>
				</Link>
				<button className='bg-red-600 text-white rounded-lg h-min px-4'>
					Seguir
				</button>
			</div>
		</div>
	);
}
