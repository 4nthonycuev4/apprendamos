/** @format */

import Image from "next/image";
import Link from "next/link";

import FollowButton from "../buttons/Follow";
import { useUser } from '@auth0/nextjs-auth0';

export default function AuthorCard({ username, name, picture }) {
  const { user, isLoading } = useUser()
  return (
    <div className="flex items-center space-x-2">
      <Link href={`/@/${username}`}>
        <a>
          <div className="relative h-14 w-14">
            <Image
              src={picture}
              alt="Picture of the author"
              layout="fill"
              objectFit="fill"
              className="rounded-full"
            />
          </div>
        </a>
      </Link>
      <div>
        <Link href={`/@/${username}`}>
          <a>
            <h1 className="-my-0.5"><span className="font-semibold">{name}</span>
              <span className="font-normal dark:text-gray-300">{` @${username}`}</span></h1>
          </a>
        </Link>
        {!isLoading && user?.username !== undefined && user?.username !== username ? <FollowButton username={username} /> : (<Link href={`/@/${username}`}>
          <a><button type="button"
            className="h-6 w-20 rounded bg-green-500 text-xs font-semibold text-white"
          >Ir al perfil</button></a></Link>)}
      </div>
    </div>
  );
}
