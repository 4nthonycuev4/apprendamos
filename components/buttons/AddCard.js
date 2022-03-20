/** @format */

import { useState } from "react";

import { PlusIcon } from "@heroicons/react/outline";

import NewCardModal from "../NewCardModal";

export default function AddCardButton() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button className='mb-2 mx-4' onClick={() => setOpen(true)}>
				<div className='bg-green-100 p-2 pr-4 flex rounded-full items-center'>
					<div className='flex items-center justify-center bg-green-200 rounded-full w-6 h-6 mr-2'>
						<PlusIcon width={16} />
					</div>
					<span>Añadir carta</span>
				</div>
			</button>
			<NewCardModal open={open} setOpen={setOpen} />
		</>
	);
}
