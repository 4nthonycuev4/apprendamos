/** @format */

import Link from "next/link";

export default function Footer() {
	return (
		<footer className='bg-white border-t sticky overflow-hidden bottom-0 flex items-center justify-center h-10 z-50'>
			<h1 className='text-gray-800 text-xs '>
				Made with 🤍 by{" "}
				<Link href='/tonybtntstark'>
					<a>Anthony</a>
				</Link>
			</h1>
		</footer>
	);
}
