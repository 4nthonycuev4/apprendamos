/** @format */

import { DotsHorizontalIcon } from "@heroicons/react/outline";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export default function Comment({ comment, author, minimal, selectComment }) {
  return (
    <div className="flex items-start space-x-4">
      <div>
        <div className="relative h-10 w-10">
          <Image
            src={author.picture}
            alt="Picture of the author"
            layout="fill"
            objectFit="fill"
            className="rounded-full"
          />
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <Link href={`/@/${author.username}`}>
            <a className="hover:underline">
              <span className="font-bold">{author.name}</span>
              <span> · </span>
              <span>@{author.username}</span>
            </a>
          </Link>
          {!minimal && (
            <button
              type="button"
              onClick={() => {
                selectComment({ comment, author });
              }}
            >
              <DotsHorizontalIcon className="w-5 text-gray-700" />
            </button>
          )}
        </div>
        <p>{comment.message}</p>
        <h1 className="font-thin text-sm text-right">{moment(comment.created).fromNow()}</h1>
      </div>
    </div>
  );
}
