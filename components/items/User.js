/** @format */

import Image from "next/image";
import Link from "next/link";

export default function User({ user, setOpen }) {
	return (
		<div className={"flex mb-1 items-center justify-start"}>
			<Image
				src={user.picture}
				width={40}
				height={40}
				alt={user.username}
				className='rounded-full'
			/>
			<Link href={`/${user.username}`}>
				<a>
					<button className='ml-3 text-left' onClick={() => setOpen(false)}>
						<h1 className='text-md font-bold -mt-1 hover:underline '>
							{user.name}
						</h1>

						<h1 className='text-md font-thin -mt-1.5'>@{user.username}</h1>
					</button>
				</a>
			</Link>
		</div>
	);
}
