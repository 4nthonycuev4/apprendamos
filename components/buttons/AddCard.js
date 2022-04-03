/** @format */

import { PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";

export default function AddCardButton({ quizID }) {
	return (
		<Link href={`/q/${quizID}/c/create`}>
			<button className='mb-2 mx-4'>
				<div className='bg-green-100 p-2 pr-4 flex rounded-full items-center'>
					<div className='flex items-center justify-center bg-green-200 rounded-full w-6 h-6 mr-2'>
						<PlusIcon width={16} />
					</div>
					<span>Añadir carta</span>
				</div>
			</button>
		</Link>
	);
}
