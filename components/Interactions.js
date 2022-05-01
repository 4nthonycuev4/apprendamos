/** @format */

import { useState, useEffect } from "react";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0";

import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";

import { AnnotationIcon as AnnotationIconSolid } from "@heroicons/react/solid";
import { AnnotationIcon as AnnotationIconOutline } from "@heroicons/react/outline";

import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/outline";

import CommentForm from "./forms/CommentForm";
import Comments from "./lists/Comments";

export default function Interactions({
	authorUsername,
	contentRef,
	startViewerStats = { like: false, comments: 0, saved: false },
	startStats,
	startComments = [],
	commentInput,
}) {
	const [viewerStats, setViewerStats] = useState(startViewerStats);
	const [stats, setStats] = useState(startStats);
	const [comments, setComments] = useState(startComments);

	const { user } = useUser();

	useEffect(async () => {
		try {
			const getViewerStats = async () => {
				return await fetch("/api/interactions/content", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						ref: contentRef,
					}),
				})
					.then((resx) => resx.json())
					.catch((err) => console.log(err));
			};
			if (!viewerStats.ref) {
				const x = await getViewerStats();
				setViewerStats(x);
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

	const likeContent = async () => {
		try {
			const resx = await fetch("/api/interactions/content/like", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					ref: contentRef,
				}),
			}).then((res) => res.json());

			setStats(resx.stats);
			setViewerStats(resx.viewerStats);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				{commentInput ? (
					<CommentForm
						contentRef={contentRef}
						comments={comments}
						setViewerStats={setViewerStats}
						setStats={setStats}
						setComments={setComments}
					/>
				) : (
					<Link
						href={`/@/${authorUsername}/${contentRef.collection.toLowerCase()}/${
							contentRef.id
						}`}>
						<a>
							<h1>Ver comentarios</h1>
						</a>
					</Link>
				)}
				<div className='flex space-x-4'>
					<div className='flex text-red-400'>
						<span>{stats.likes}</span>
						<button disabled={!user?.ref} onClick={() => likeContent()}>
							{viewerStats && viewerStats.like ? (
								<HeartIconSolid className='w-5' />
							) : (
								<HeartIconOutline strokeWidth={1.5} className='w-5' />
							)}
						</button>
					</div>
					<div className='flex text-blue-400'>
						<span>{stats.comments}</span>
						<button disabled>
							{viewerStats && viewerStats.comments > 0 ? (
								<AnnotationIconSolid className='w-5' />
							) : (
								<AnnotationIconOutline strokeWidth={1.5} className='w-5' />
							)}
						</button>
					</div>

					<div className='flex text-gray-700'>
						<span>{stats.saved}</span>
						<button disabled>
							{viewerStats && viewerStats.saved > 0 ? (
								<BookmarkIconSolid className='w-5' />
							) : (
								<BookmarkIconOutline strokeWidth={1.5} className='w-5' />
							)}
						</button>
					</div>
				</div>
			</div>
			{comments.length > 0 && <Comments comments={comments} />}
		</div>
	);
}
