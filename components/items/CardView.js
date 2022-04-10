/** @format */

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";

import Card from "./Card";
export default function CardView({ cards, canEdit }) {
	const [viewing, setViewing] = useState(0);

	const [selected, setSelected] = useState(false);
	if (!cards || !cards.length) {
		return <div>Sin cartas :(</div>;
	}
	return (
		<div className='px-4'>
			<button
				className='w-full'
				onClick={() => {
					setSelected(!selected);
				}}>
				<Card card={cards[viewing]} canEdit={canEdit} selected={selected} />
			</button>
			<div className='flex justify-center'>
				{viewing < cards.length - 1 && (
					<button
						onClick={() => {
							setViewing(viewing + 1);
							setSelected(false);
						}}>
						<ArrowRightIcon className='h-5 w-5' />
					</button>
				)}
				<span className='mx-5 font-bold'>{`${viewing + 1}/${
					cards.length
				}`}</span>
				{viewing > 0 && (
					<button
						onClick={() => {
							setViewing(viewing - 1);
							setSelected(false);
						}}>
						<ArrowLeftIcon className='h-5 w-5' />
					</button>
				)}
			</div>
		</div>
	);
}
