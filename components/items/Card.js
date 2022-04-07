/** @format */
import { useState } from "react";

import Link from "next/link";

import { PencilIcon } from "@heroicons/react/outline";

export default function Card({ card, canEdit, selected }) {
	const bgColor = selected ? "bg-red-100" : "bg-blue-100";
	const fontBold = selected ? "font-bold" : "";

	return (
		<div className={bgColor}>
			<div className='flex h-48 sm:h-72 p-2 justify-center items-center rounded-md drop-shadow-sm'>
				<h1 className={"text-center whitespace-pre-line " + fontBold}>
					{selected ? card.back : card.front}
				</h1>
			</div>
			{canEdit && (
				<div className='flex p-1 justify-end'>
					<Link href={"/q/" + card.quiz + "/c/" + card.id + "/edit"}>
						<a>
							<button
								onClick={(e) => {
									e.stopPropagation();
									console.log("hola");
								}}
								className='rounded-full border-2 border-transparent hover:border-gray-600 p-2'>
								<PencilIcon className='h-5 w-5 text-gray-600' />
							</button>
						</a>
					</Link>
				</div>
			)}
		</div>
	);
}
