/** @format */

import { useState, useEffect } from "react";

import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";

import { AnnotationIcon as AnnotationIconSolid } from "@heroicons/react/solid";
import { AnnotationIcon as AnnotationIconOutline } from "@heroicons/react/outline";

import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/outline";

import CommentForm from "./forms/CommentForm";
import Comments from "./lists/Comments";

export default function Interactions({
	contentRef,
	minimal = false,
	startViewerStats = { like: false, comments: 0, saved: false },
	startStats,
	startComments = [],
}) {
	const [viewerStats, setViewerStats] = useState(startViewerStats);
	const [stats, setStats] = useState(startStats);
	const [comments, setComments] = useState(startComments);

	useEffect(() => {
		try {
			const getViewerStats = async () => {
				const res = await fetch("/api/interactions", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						ref: contentRef,
					}),
				}).then((res) => res.json());

				setViewerStats(res);
			};
			if (!viewerStats.ref) {
				getViewerStats();
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

	const likeContent = async () => {
		try {
			const res = await fetch("/api/interactions/likeContent", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					ref: contentRef,
				}),
			}).then((res) => res.json());

			setStats(res.stats);
			setViewerStats(res.viewerStats);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<CommentForm
					contentRef={contentRef}
					setViewerStats={setViewerStats}
					setStats={setStats}
					setComments={setComments}
				/>
				<div className='flex space-x-4'>
					<div className='flex text-red-400'>
						<span>{stats.likes}</span>
						<button onClick={() => likeContent()}>
							{viewerStats.like ? (
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
			</div>
			<Comments comments={comments} />
		</div>
	);
}
