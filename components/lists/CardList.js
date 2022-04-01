/** @format */

import { useState } from "react";

import Card from "../items/Card";

export default function CardList({ cards, canEdit }) {
	const [selected, setSelected] = useState(null);

	const handleSelected = (card) => {
		if (selected === card.id) {
			setSelected(null);
		} else {
			setSelected(card.id);
		}
	};

	if (!cards?.length) {
		return <p className='text-center text-gray-500'>No hay cartas</p>;
	}

	return (
		<div className='px-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
			{cards.map((card) => (
				<div
					className='hover:cursor-pointer'
					key={card.id}
					onClick={() => handleSelected(card)}>
					<Card card={card} selected={selected === card.id} canEdit={canEdit} />
				</div>
			))}
		</div>
	);
}
