/** @format */

import React, { useState } from "react";

export default function Body({ body }) {
	const [showBody, setShowBody] = useState(false);
	return (
		<div>
			<button
				className='bg-red-800 text-xs hover:bg-red-900 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mb-2'
				type='submit'
				onClick={() => setShowBody(!showBody)}>
				{showBody ? "Ocultar" : "Mostrar 👇"}
			</button>
			{showBody && (
				<div className='relative'>
					<p className='text-gray-800 bg-gray-300 rounded-md p-2'>{body}</p>
				</div>
			)}
		</div>
	);
}
