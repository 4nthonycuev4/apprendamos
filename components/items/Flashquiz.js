/** @format */

import Link from "next/link";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import moment from "moment";

import TagList from "../lists/Tags";
import CardView from "./CardView";
import StatsCard from "./StatsCard";
import AuthorCard from "./AuthorCard";

export default function Flashquiz({ flashquiz }) {
	return (
		<div className='p-4 rounded-lg border space-y-2'>
			<Link
				href={`/@/${flashquiz.author.username}/flashquizzes/${flashquiz.ref.id}`}>
				<a className='hover:underline font-bold text-xl'>{flashquiz.name}</a>
			</Link>
			<CardView cards={flashquiz.flashcards} canEdit={false} />
			<TagList tags={flashquiz.tags}></TagList>
			<div className='flex justify-between'>
				<AuthorCard author={flashquiz.author} />
				<StatsCard stats={flashquiz.stats} />
			</div>
			<div className='flex justify-between'>
				<p>Creado {moment(flashquiz.created).fromNow()}</p>
				<button>
					<Link
						href={`/@/${flashquiz.author.username}/flashquizzes/${flashquiz.ref.id}/options`}>
						<a>
							<DotsHorizontalIcon className='text-gray-700 w-5' />
						</a>
					</Link>
				</button>
			</div>
		</div>
	);
}
