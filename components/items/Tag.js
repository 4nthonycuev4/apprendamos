/** @format */

import Link from "next/link";

export default function Tag({ tag }) {
	return (
		<Link href={`/tags/${tag}`}>
			<a>
				<button className='bg-gray-200 rounded-md px-3 py-1 text-sm font-semibold mr-2 hover:bg-gray-400'>
					{tag}
				</button>
			</a>
		</Link>
	);
}
