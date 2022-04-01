/** @format */

import { useState, useEffect } from "react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ToggleFollowButton({ username }) {
	const [loading, setLoading] = useState(true);
	const [following, setFollowing] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetcher(
				`/api/profiles/${username}/social/viewerIsFollowing`
			);
			setFollowing(response);
			setLoading(false);
		};
		fetchData();
	}, []);

	const ToggleFollow = async () => {
		setLoading(true);
		const newState = await fetcher(
			`/api/profiles/${username}/social/toggleFollow`
		);
		setFollowing(newState);
		setLoading(false);
	};

	if (loading) {
		return (
			<button className='-mt-1 w-28 h-8 font-medium rounded-full border-2 border-gray-900'>
				pera...
			</button>
		);
	}

	return (
		<button
			onClick={() => ToggleFollow()}
			className={`-mt-1 w-28 h-8 font-medium rounded-full border-2 border-gray-900 ${
				following ? "" : "bg-gray-900 text-white"
			}`}>
			{following ? "Siguiendo" : "Seguir"}
		</button>
	);
}
