/** @format */

import Link from "next/link";

import TagList from "../lists/TagList";

import moment from "moment";

export default function Quiz({ quiz }) {
	const time = new Date(quiz.ts).toISOString();

	const aboutParsed = quiz.about.substring(0, 250);

	const relativeTime = moment(quiz.ts).fromNow();
	return (
		<article className='border-y p-4 hover:bg-gray-100'>
			<Link href={`/quizzes/${quiz.id}`}>
				<a>
					<h1 className='text-lg font-bold hover:underline'>
						{quiz.title}
						<span className='text-xs font-thin cursor-pointer'>
							<time dateTime={time}> · {relativeTime}</time>
						</span>
					</h1>
				</a>
			</Link>

			<h1 className='text-md font-normal mb-2'>
				{aboutParsed}
				{aboutParsed.length == 250 && (
					<Link href={`/quizzes/${quiz.id}`}>
						<a className='font-normal text-justify hover:underline'>
							<span className='font-medium'>[...leer más]</span>
						</a>
					</Link>
				)}
			</h1>

			<TagList tags={quiz.tags}></TagList>
		</article>
	);
}
