/** @format */
import Link from "next/link";

export default function Tags({ tags }) {
	return (
		<div className='flex flex-wrap gap-2'>
			{tags &&
				tags.length > 0 &&
				tags.map((tag, index) => (
					<button
						key={index}
						className='flex items-center rounded-md bg-sky-800 px-4 py-1 text-sky-300 font-semibold text-xs'>
						<Link href={`/tag/${tag.parsed}`}>
							<a>
								<span>{tag.raw}</span>
							</a>
						</Link>
					</button>
				))}
		</div>
	);
}
