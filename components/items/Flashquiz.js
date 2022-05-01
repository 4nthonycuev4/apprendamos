/** @format */

import Link from "next/link";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import moment from "moment";

import Tags from "../Tags";
import CardView from "./CardView";
import AuthorCard from "./AuthorCard";
import Interactions from "../Interactions";

export default function Flashquiz({
	flashquiz,
	author,
	comments,
	startViewerStats,
	commentInput = true,
}) {
	return (
		<div className='p-4 rounded-lg border space-y-2'>
			<Link href={`/@/${author.username}/flashquizzes/${flashquiz.ref.id}`}>
				<a className='hover:underline font-bold text-xl'>{flashquiz.name}</a>
			</Link>
			<CardView cards={flashquiz.flashcards} canEdit={false} />
			<Tags tags={flashquiz.tags}></Tags>
			<div className='flex justify-between items-center'>
				<AuthorCard author={author} />

				<div className='flex space-x-1'>
					<p className='text-right'>{moment(flashquiz.created).fromNow()}</p>
					<button>
						<Link
							href={`/@/${author.username}/posts/${flashquiz.ref.id}/options`}>
							<a>
								<DotsHorizontalIcon className='text-gray-700 w-5' />
							</a>
						</Link>
					</button>
				</div>
			</div>
			<Interactions
				authorUsername={author.username}
				startViewerStats={startViewerStats}
				contentRef={flashquiz.ref}
				startStats={flashquiz.stats}
				startComments={comments}
				commentInput={commentInput}
			/>
		</div>
	);
}
