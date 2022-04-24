/** @format */

import Image from "next/image";
import Link from "next/link";

import { CalendarIcon } from "@heroicons/react/outline";
import moment from "moment";

import ToggleFollowButton from "../buttons/ToggleFollowButton";

export default function BigProfile({ profile }) {
	return (
		<>
			<div className='text-center py-1 border-y px-4'>
				<Image
					width={100}
					height={100}
					src={profile.picture}
					alt='Picture of the user'
					className='rounded-full'
				/>
				<div className='text-center'>
					<h1 className='font-bold text-xl'>{profile.name}</h1>
					<h1 className='font-normal text-md mb-2'>@{profile.username}</h1>

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
				<div className='flex justify-center space-x-4'>
					<h1 className='text-gray-600 font-bold'>
						{profile.stats.followers}
						<span className='font-normal'> Seguidores</span>
					</h1>

					<h1 className='text-gray-600 font-bold'>
						{profile.stats.following}
						<span className='font-normal'> Siguiendo</span>
					</h1>
				</div>
			</div>
		</>
	);
}
