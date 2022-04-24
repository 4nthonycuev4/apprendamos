/** @format */

import Image from "next/image";

import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";

import { AnnotationIcon as AnnotationIconSolid } from "@heroicons/react/solid";
import { AnnotationIcon as AnnotationIconOutline } from "@heroicons/react/outline";

import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/outline";

export default function StatsCard({
	stats,
	viewerStats = { likes: true, comments: 0, saved: false },
}) {
	return (
		<div className='flex space-x-4 items-center justify-end'>
			<div className='flex text-red-400'>
				<span>{stats.likes}</span>
				<button>
					{viewerStats.likes ? (
						<HeartIconSolid className='w-5' />
					) : (
						<HeartIconOutline strokeWidth={1.5} className='w-5' />
					)}
				</button>
			</div>
			<div className='flex text-blue-400'>
				<span>{stats.comments}</span>
				<button>
					{viewerStats.comments > 0 ? (
						<AnnotationIconSolid className='w-5' />
					) : (
						<AnnotationIconOutline strokeWidth={1.5} className='w-5' />
					)}
				</button>
			</div>

			<div className='flex text-gray-700'>
				<span>{stats.saved}</span>
				<button>
					{viewerStats.saved > 0 ? (
						<BookmarkIconSolid className='w-5' />
					) : (
						<BookmarkIconOutline strokeWidth={1.5} className='w-5' />
					)}
				</button>
			</div>
		</div>
	);
}
