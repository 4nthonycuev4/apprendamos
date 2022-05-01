/** @format */

import { useState, useEffect } from "react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ToggleFollowButton({ username, startStats }) {
	const [viewerStats, setViewerStats] = useState({ following: false });
	const [stats, setStats] = useState(startStats);

	useEffect(async () => {
		try {
			const getViewerStats = async () => {
				return await fetch("/api/interactions/user", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username,
					}),
				})
					.then((resx) => resx.json())
					.catch((err) => console.log(err));
			};
			if (!viewerStats.ref) {
				const x = await getViewerStats();
				setViewerStats(x);
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

	return (
		<button
			onClick={followAuthor}
			className={`-mt-1 w-28 h-8 font-medium rounded-full border-2 border-gray-900 ${
				following ? "" : "bg-gray-900 text-white"
			}`}>
			{following ? "Siguiendo" : "Seguir"}
		</button>
	);
}
