/** @format */

import { useState } from "react";
import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";

import { ThumbUpIcon as ThumbUpIconSolid } from "@heroicons/react/solid";
import { ThumbUpIcon as ThumbUpIconOutline } from "@heroicons/react/outline";
import { ThumbDownIcon as ThumbDownIconSolid } from "@heroicons/react/solid";
import { ThumbDownIcon as ThumbDownIconOutline } from "@heroicons/react/outline";

function SocialData({ quizId }) {
	const [handlingReact, setHandlingReact] = useState(false);
	const { mutate } = useSWRConfig();

	const { data: viewerReaction } = useSWR(
		`/api/quizzes/${quizId}/viewerReaction`
	);

	const { data: socialData } = useSWR(`/api/quizzes/${quizId}/socialData`);

	const handleReact = async (newReaction) => {
		setHandlingReact(true);
		await fetch(`/api/quizzes/${quizId}/react`, {
			method: "POST",
			body: JSON.stringify({ newReaction }),
			headers: {
				"Content-Type": "application/json",
			},
		}).catch((err) => console.error(err));
		mutate(`/api/quizzes/${quizId}/viewerReaction`);
		mutate(`/api/quizzes/${quizId}/socialData`);

		setHandlingReact(false);
	};
	return (
		<div className='flex'>
			<div className='flex text-gray-600 mr-4'>
				<Link href={`/q/${quizId}/social`}>
					<a className='font-thin hover:underline mr-1'>
						{socialData?.likeCount || 0}
					</a>
				</Link>
				<button disabled={handlingReact} onClick={() => handleReact("like")}>
					{viewerReaction?.reaction === "like" ? (
						<ThumbUpIconSolid className='w-5' />
					) : (
						<ThumbUpIconOutline strokeWidth={1.5} className='w-5' />
					)}
				</button>
			</div>
			<div className='flex text-gray-600'>
				<Link href={`/q/${quizId}/social`}>
					<a className='font-thin hover:underline mr-1'>
						{socialData?.dislikeCount || 0}
					</a>
				</Link>
				<button
					disabled={handlingReact}
					onClick={() => handleReact("dislike")}
					ñ>
					{viewerReaction?.reaction === "dislike" ? (
						<ThumbDownIconSolid className='w-5' />
					) : (
						<ThumbDownIconOutline strokeWidth={1.5} className='w-5' />
					)}
				</button>
			</div>
		</div>
	);
}

export default SocialData;
