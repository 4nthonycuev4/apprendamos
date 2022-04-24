/** @format */

import Image from "next/image";
import Link from "next/link";

export default function Comment({ comment }) {
	return (
		<div className='flex space-x-2'>
			<Image
				src={comment.author.picture}
				alt='Picture of the user'
				width={48}
				height={48}
				className='rounded-full'
			/>
			<div>
				<Link href={`/@/${comment.author.username}`}>
					<a className='hover:underline'>
						<span className='font-bold'>{comment.author.name}</span>
						<span> · </span>
						<span>{comment.author.username}</span>
					</a>
				</Link>
				<p>{comment.message}</p>
			</div>
		</div>
	);
}
