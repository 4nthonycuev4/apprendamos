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
					src={profile.picture}
					alt='Picture of the user'
					width={100}
					height={100}
					className='rounded-full '
				/>
				<div className='text-center'>
					<Link href={`/p/${profile.username}`}>
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
					<Link href={`/p/${profile.username}/followers`}>
						<a>
							<h1 className='text-gray-600 font-bold hover:underline'>
								{profile.followerCount}
								<span className='font-normal'> Seguidores</span>
							</h1>
						</a>
					</Link>

					<Link href={`/p/${profile.username}/following`}>
						<a className='ml-3'>
							<h1 className='text-gray-600 font-bold hover:underline'>
								{profile.followingCount}
								<span className='font-normal'> Siguiendo</span>
							</h1>
						</a>
					</Link>
				</div>
			</div>
		</>
	);
}
