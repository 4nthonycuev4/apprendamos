/** @format */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";

export default function AuthorStats({ startStats, username }) {
	const [stats, setStats] = useState(startStats);
	const [viewerStats, setViewerStats] = useState({ following: false });

	const { user } = useUser();

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

	const follow = async () => {
		try {
			const resx = await fetch("/api/interactions/user/follow", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
				}),
			}).then((res) => res.json());

			setStats(resx.stats);
			setViewerStats(resx.viewerStats);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			{user && user.username === username ? (
				<button
					type='button'
					className='text-white text-sm font-normal px-4 rounded w-32 h-6 bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600'>
					<Link href='/settings'>
						<a>Editar perfil</a>
					</Link>
				</button>
			) : viewerStats.following ? (
				<button
					type='button'
					disabled={!user}
					onClick={follow}
					className='text-white text-sm font-normal px-4 rounded w-32 h-6 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'>
					Siguiendo
				</button>
			) : (
				<button
					type='button'
					disabled={!user}
					onClick={follow}
					className='text-white text-sm font-normal px-4 rounded w-32 h-6 bg-black hover:bg-slate-800'>
					Seguir
				</button>
			)}
			<div className='flex justify-center space-x-4'>
				<h1 className='text-gray-600 font-bold'>
					{stats.followers}
					<span className='font-normal'> Seguidores</span>
				</h1>

				<h1 className='text-gray-600 font-bold'>
					{stats.following}
					<span className='font-normal'> Siguiendo</span>
				</h1>

				<h1 className='text-gray-600 font-bold'>
					{stats.received.likes}
					<span className='font-normal'> Likes</span>
				</h1>
			</div>
		</div>
	);
}
