/** @format */
import Link from "next/link";
import moment from "moment";
import { DotsHorizontalIcon } from "@heroicons/react/outline";

import AuthorCard from "./AuthorCard";
import TagList from "../lists/Tags";
import StatsCard from "./StatsCard";

export default function Post({ post, preview = false }) {
	return (
		<div className='p-4 rounded-lg border  space-y-2'>
			<article
				className={"prose" + (preview ? " line-clamp-5" : "")}
				dangerouslySetInnerHTML={{ __html: post.body }}
			/>
			{preview && (
				<Link href={`/@/${post.author.username}/posts/${post.ref.id}`}>
					<a className='hover:underline font-bold'>seguir leyendo...</a>
				</Link>
			)}
			<TagList tags={post.tags}></TagList>
			<div className='flex justify-between'>
				<AuthorCard author={post.author} />
				<StatsCard stats={post.stats} />
			</div>
			<div className='flex justify-between'>
				<p>Creado {moment(post.created).fromNow()}</p>
				<button>
					<Link
						href={`/@/${post.author.username}/posts/${post.ref.id}/options`}>
						<a>
							<DotsHorizontalIcon className='text-gray-700 w-5' />
						</a>
					</Link>
				</button>
			</div>
		</div>
	);
}
