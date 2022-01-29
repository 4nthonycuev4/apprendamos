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
				<div className='relative min-h-[100px] bg-gray-300 rounded-md p-2'>
					<p
						className='selection:bg-fuchsia-300 selection:text-fuchsia-900 first-letter:uppercase first-letter:text-7xl first-letter:font-bold first-letter:text-slate-900
  first-letter:mr-3 first-letter:float-left text-gray-800 break-all whitespace-pre-wrap'>
						{body}
					</p>
				</div>
			)}
		</div>
	);
}
