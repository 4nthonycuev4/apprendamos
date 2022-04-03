/** @format */

import Link from "next/link";

import {
	HomeIcon,
	TrendingUpIcon,
	SearchIcon,
	BellIcon,
	MenuIcon,
} from "@heroicons/react/outline";

export default function Footer() {
	return (
		<footer
			className='
				h-12 z-50 sticky bottom-0 
				grid grid-cols-5 justify-center
				bg-white/30 backdrop-blur-md 
				border-t 
				text-gray-800'>
			<Link href='/'>
				<a className='flex justify-center items-center'>
					<button className='rounded-full hover:bg-gray-200 p-2'>
						<HomeIcon className='h-6 w-6' />
					</button>
				</a>
			</Link>
			<Link href='/'>
				<a className='flex justify-center items-center'>
					<button className='rounded-full hover:bg-gray-200 p-2'>
						<TrendingUpIcon className='h-6 w-6' />
					</button>
				</a>
			</Link>
			<Link href='/'>
				<a className='flex justify-center items-center'>
					<button className='rounded-full hover:bg-gray-200 p-2'>
						<SearchIcon className='h-6 w-6' />
					</button>
				</a>
			</Link>
			<Link href='/'>
				<a className='flex justify-center items-center'>
					<button className='rounded-full hover:bg-gray-200 p-2'>
						<BellIcon className='h-6 w-6' />
					</button>
				</a>
			</Link>
			<Link href='/'>
				<a className='flex justify-center items-center'>
					<button className='rounded-full hover:bg-gray-200 p-2'>
						<MenuIcon className='h-6 w-6' />
					</button>
				</a>
			</Link>
		</footer>
	);
}
