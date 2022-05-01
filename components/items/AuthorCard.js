/** @format */

import Image from "next/image";
import Link from "next/link";

export default function AuthorCard({ author }) {
	return (
		<div className='flex space-x-4 items-center'>
			<div className='w-18'>
				<Image
					src={author.picture}
					alt='Picture of the user'
					width={70}
					height={70}
					className='rounded-full'
				/>
			</div>
			<div className='text-left w-40'>
				<Link href={`/@/${author.username}`}>
					<a className='hover:underline'>
						<h1 className='font-bold'>{author.name}</h1>
						<h1 className='font-normal'>@{author.username}</h1>
					</a>
				</Link>
			</div>
		</div>
	);
}
