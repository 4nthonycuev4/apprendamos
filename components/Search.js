/** @format */

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { SearchIcon, TagIcon } from "@heroicons/react/solid";

export default function Search() {
	const router = useRouter();

	const [search, setSearch] = useState("");

	return (
		<div className='rounded-md shadow-sm overflow-hidden h-12 border border-gray-300 flex items-center relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 w-64'>
			<div className='flex items-center justify-center px-3'>
				<TagIcon className='h-5 w-5 text-gray-500' />
			</div>
			<input
				type='search'
				name='search'
				id='search'
				className='outline-none w-2/3'
				placeholder='Buscar por tag...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						router.push(`/tags/${search}`);
					}
				}}
			/>
			<div className='h-full'>
				<Link href={`/t/${search.toLowerCase()}`}>
					<a>
						<div className='flex items-center justify-center h-full px-5 bg-gray-200 cursor-pointer'>
							<SearchIcon className='h-5 w-5 text-gray-500' />
						</div>
					</a>
				</Link>
			</div>
		</div>
	);
}
