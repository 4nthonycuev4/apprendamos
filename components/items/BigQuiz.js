/** @format */
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import moment from "moment";

import TagList from "../lists/TagList";

export default function BigQuiz({ quiz, profile, user, isLoading }) {
	const time = new Date(quiz.ts).toISOString();

	const relativeTime = moment(quiz.ts).fromNow();
	const absoluteTime = moment(quiz.ts).format("LLL");

	const [timeShown, setTimeShown] = useState("relative");

	const handleTimeShown = () => {
		if (timeShown === "relative") {
			setTimeShown("absolute");
		} else {
			setTimeShown("relative");
		}
	};
	return (
		<div className='py-2 px-4 border-y'>
			<div className='flex justify-between'>
				<div className='flex'>
					<div className='pr-2'>
						<Image
							src={profile.picture}
							width={50}
							height={50}
							alt={profile.username}
							className='rounded-full'
						/>
					</div>
					<div className='content'>
						<div className='flex'>
							<Link href={`/p/${profile.username}`}>
								<a>
									<div className='flex'>
										<h1 className='text-md font-bold mr-1 hover:underline'>
											{profile.name}
										</h1>
										<h1 className='text-md font-thin'>@{profile.username}</h1>
									</div>
								</a>
							</Link>
							<span className='mx-1'>·</span>
							<button onClick={handleTimeShown}>
								<time
									dateTime={time}
									className='text-xs font-thin cursor-pointer hover:underline'>
									{timeShown === "relative" ? relativeTime : absoluteTime}
								</time>
							</button>
						</div>
						<h1 className='text-md mb-2 whitespace-pre-line'>{quiz.about}</h1>
					</div>
				</div>
			</div>

			<TagList tags={quiz.tags} />

			{!isLoading && user?.sub === quiz.owner && (
				<Link href={`/q/${quiz.id}/edit`}>
					<button className='w-20 rounded-full bg-red-100'>Editar</button>
				</Link>
			)}
		</div>
	);
}
