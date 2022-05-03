/** @format */

import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { DotsHorizontalIcon } from "@heroicons/react/outline";

export default function Comment({ comment, author, minimal, selectComment }) {
	return (
		<div className='flex items-start space-x-4'>
			<div>
				<div className='h-16 w-16 relative'>
					<Image
						src={author.picture}
						alt='Picture of the author'
						layout='fill'
						objectFit='fill'
						className='rounded-full'
					/>
				</div>
			</div>
			<div className='w-full'>
				<div className='flex justify-between'>
					<Link href={`/@/${author.username}`}>
						<a className='hover:underline'>
							<span className='font-bold'>{author.name}</span>
							<span> · </span>
							<span>@{author.username}</span>
							<span> · </span>
							<span>{moment(comment.created).fromNow()}</span>
						</a>
					</Link>
					{!minimal && (
						<button
							onClick={() => {
								selectComment({ comment, author });
							}}>
							<DotsHorizontalIcon className='text-gray-700 w-5' />
						</button>
					)}
				</div>
				<p>{comment.message}</p>
			</div>
		</div>
	);
}
