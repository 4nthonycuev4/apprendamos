/** @format */

import Image from "next/image";
import Link from "next/link";

export default function User({ user }) {
  return (
    <article
      id={user.id}
      className="flex items-center justify-start border-y px-4 py-2 hover:bg-gray-100"
    >
      <Image
        src={user.picture}
        width={40}
        height={40}
        alt={user.username}
        className="rounded-full"
      />
      <Link href={`/p/${user.username}`}>
        <a>
          <h1 className="text-md -mt-1 ml-2 font-bold hover:underline">
            {user.name}
          </h1>

          <h1 className="text-md -mt-1.5 ml-2 font-thin">@{user.username}</h1>
        </a>
      </Link>
    </article>
  );
}
