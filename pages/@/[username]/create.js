/** @format */

import Link from "next/link";
import { useRouter } from "next/router";

export default function CreatePage() {
	const router = useRouter();
	const { username } = router.query;

	return (
		<div className='flex flex-col px-20 space-y-2'>
			<Link href={`/@/${username}/posts/create`}>
				<a className='rounded-lg border py-2 justify-center flex'>
					<button>Crear post</button>
				</a>
			</Link>
			<Link href={`/@/${username}/flashquizzes/create`}>
				<a className='justify-center flex border'>
					<button className='rounded-lg  py-2'>Crear flashquiz</button>
				</a>
			</Link>
			<button
				className='rounded-lg py-2 border'
				type='button'
				onClick={() => router.back()}>
				Atrás
			</button>
		</div>
	);
}
