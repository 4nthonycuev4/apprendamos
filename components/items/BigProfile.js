/** @format */
import { useState } from "react";

import useSWR from "swr";

import Image from "next/image";
import Link from "next/link";

import { CalendarIcon } from "@heroicons/react/outline";
import moment from "moment";

import UserListModal from "../UserListModal";
import ToggleFollowButton from "../ToggleFollowButton";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function BigProfile({ profile, quizCount }) {
	const [followerListModalOpen, setFollowerListModalOpen] = useState(false);
	const [followingListModalOpen, setFollowingListModalOpen] = useState(false);

	const { data: followers } = useSWR(
		`/api/profiles/${profile.username}/social/followers`,
		fetcher
	);

	const { data: following } = useSWR(
		`/api/profiles/${profile.username}/social/following`,
		fetcher
	);
	const { data: metrics } = useSWR(
		`/api/profiles/${profile.username}/social`,
		fetcher
	);

	return (
		<>
			<div className='text-center py-1 border-y'>
				<Image
					src={profile.picture}
					alt='Picture of the user'
					width={100}
					height={100}
					className='rounded-full '
				/>
				<div className='text-center'>
					<Link href={`/${profile.username}`}>
						<a>
							<h1 className='font-normal text-xl mb-2'>@{profile.username}</h1>
						</a>
					</Link>
					<ToggleFollowButton username={profile.username} />
				</div>
				<p>{profile.bio}</p>
				<div className='flex h-6 itmes-center justify-center text-gray-500'>
					<div className='pt-[2px] pr-1'>
						<CalendarIcon className='w-5 h-5' />
					</div>
					<h1 className='font-normal text-md'>
						Se unió el {moment(profile.joined).format("LL")}
					</h1>
				</div>
				<div className='flex justify-center'>
					<button
						className='mr-3'
						onClick={() => setFollowingListModalOpen(true)}>
						<h1 className='text-gray-600 font-bold hover:underline'>
							{metrics && metrics.followingCount}
							<span className='font-normal'> Siguiendo</span>
						</h1>
					</button>

					<button className='' onClick={() => setFollowerListModalOpen(true)}>
						<h1 className='text-gray-600 font-bold  hover:underline'>
							{metrics && metrics.followerCount}
							<span className='font-normal'> Seguidores</span>
						</h1>
					</button>
				</div>
			</div>

			<UserListModal
				open={followerListModalOpen}
				setOpen={setFollowerListModalOpen}
				users={followers}
				title='Seguidores'
			/>
			<UserListModal
				open={followingListModalOpen}
				setOpen={setFollowingListModalOpen}
				users={following}
				title='Siguiendo'
			/>
		</>
	);
}
