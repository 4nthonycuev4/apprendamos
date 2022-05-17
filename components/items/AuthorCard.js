/** @format */

import Image from "next/image";
import Link from "next/link";

export default function AuthorCard({ author }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative h-14 w-14">
        <Image
          src={author.picture}
          alt="Picture of the author"
          layout="fill"
          objectFit="fill"
          className="rounded-full"
        />
      </div>
      <div className="w-40 text-left">
        <Link href={`/@/${author.username}`}>
          <a className="hover:underline">
            <h1 className="font-bold">{author.name}</h1>
            <h1 className="font-normal">@{author.username}</h1>
          </a>
        </Link>
      </div>
    </div>
  );
}
