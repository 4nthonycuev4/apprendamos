/** @format */
import Link from "next/link";
import moment from "moment";
import { DotsHorizontalIcon } from "@heroicons/react/outline";

import AuthorCard from "./AuthorCard";
import Tags from "../Tags";
import Interactions from "../Interactions";

export default function Post({
	post,
	author,
	comments,
	startViewerStats,
	minimal,
	commentInput = true,
}) {
	return (
		<div className='p-4 rounded-lg border  space-y-2'>
			<article
				className={"prose" + (minimal ? " line-clamp-5" : "")}
				dangerouslySetInnerHTML={{ __html: post.bodyHTML }}
			/>
			{minimal && (
				<Link href={`/@/${author.username}/posts/${post.ref.id}`}>
					<a className='hover:underline font-bold'>seguir leyendo...</a>
				</Link>
			)}
			<Tags tags={post.tags}></Tags>
			<div className='flex justify-between items-center'>
				<AuthorCard author={author} />

				<div className='flex space-x-1'>
					<p className='text-right'>{moment(post.created).fromNow()}</p>
					<button>
						<Link href={`/@/${author.username}/posts/${post.ref.id}/options`}>
							<a>
								<DotsHorizontalIcon className='text-gray-700 w-5' />
							</a>
						</Link>
					</button>
				</div>
			</div>
			<Interactions
				contentRef={post.ref}
				authorUsername={author.username}
				startViewerStats={startViewerStats}
				startStats={post.stats}
				startComments={comments}
				commentInput={commentInput}
			/>
		</div>
	);
}
