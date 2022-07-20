/** @format */

import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export default function Comment({ message, created, updated, author }) {
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
                    <Link href={`/${author.username}`}>
                        <a className="hover:underline">
                            <span className="font-bold">{author.name}</span>
                            <span> · </span>
                            <span>@{author.username}</span>
                        </a>
                    </Link>
                </div>
                <p>{message}</p>
                <h1 className="font-thin text-sm text-right">
                    {moment(created).fromNow()}
                </h1>
            </div>
        </div>
    );
}
