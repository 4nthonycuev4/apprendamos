/** @format */

import Link from "next/link";

function Tag({ tag }) {
	return (
		<Link href={`/t/${tag}`}>
			<a>
				<button className='bg-gray-200 rounded-md px-3 py-1 text-sm font-semibold mr-2 hover:bg-gray-400'>
					{tag}
				</button>
			</a>
		</Link>
	);
}

export default function Tags({ tags }) {
	return (
		<div className='flex self-center mb-1'>
			{tags?.length > 0 && tags.map((tag) => <Tag tag={tag} key={tag} />)}
		</div>
	);
}
