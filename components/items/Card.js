/** @format */
import { useState } from "react";

import Link from "next/link";

import { PencilIcon } from "@heroicons/react/outline";

export default function Card({ card, selected }) {
	const bgColor = selected ? "bg-red-100" : "bg-blue-100";
	const fontBold = selected ? "font-bold" : "";

	return (
		<div className={bgColor}>
			<div className='flex h-48 sm:h-72 p-2 justify-center items-center drop-shadow-sm'>
				<h1 className={"text-center whitespace-pre-line " + fontBold}>
					{selected ? card.back : card.front}
				</h1>
			</div>
		</div>
	);
}
