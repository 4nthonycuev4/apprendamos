/** @format */

import Body from "./Body";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { AiOutlineEdit } from "react-icons/ai";

export default function Tweet({ tweet }) {
	const { user } = useUser();

	return (
		<div className='bg-gray-100 p-4 rounded-md my-2 shadow-lg'>
			<div className='flex items-center justify-between mb-2'>
				<h2 className='text-l text-gray-800 font-bold'>{tweet.data.title}</h2>
				<span className='font-bold text-xs text-red-800 px-2 py-1 rounded-lg '>
					{tweet.data.topic}
				</span>
			</div>
			<Body body={tweet.data.body} />
			{user && user.sub == tweet.data.userId && (
				<>
					<Link href={`/edit/${tweet.id}`}>
						<a className='text-gray-800 mr-2 mt-2 flex items-center'>
							Editar
							<AiOutlineEdit style={{ marginLeft: "5px" }} />
						</a>
					</Link>
				</>
			)}
			<p className='text-xs text-gray-800 text-right'>
				Actualizado el {new Date(tweet.ts / 1000).toLocaleString()}
			</p>
		</div>
	);
}
