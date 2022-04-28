/** @format */

import Image from "next/image";
import Link from "next/link";

export default function Comment({ comment, author }) {
	return (
		<div className='flex space-x-2'>
			<Image
				src={author.picture}
				alt='Picture of the user'
				width={50}
				height={50}
				className='rounded-full'
			/>
			<div>
				<Link href={`/@/${author.username}`}>
					<a className='hover:underline'>
						<span className='font-bold'>{author.name}</span>
						<span> · </span>
						<span>@{author.username}</span>
					</a>
				</Link>
				<p>{comment.message}</p>
			</div>
		</div>
	);
}
