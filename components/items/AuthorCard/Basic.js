/** @format */

import Image from "next/image";
import Link from "next/link";

export default function BasicAuthorCard({ username, picture, name }) {
    return (
        <div className="flex items-center space-x-2">
            <Link href={`/@${username}`}>
                <a>
                    <div className="relative h-10 w-10">
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
                <Link href={`/@${username}`}>
                    <a>
                        <h1 className="font-semibold text-sm -mb-1">{name}</h1>
                        <h1 className="font-normal text-sm dark:text-gray-300">{`@${username}`}</h1>
                    </a>
                </Link>
            </div>
        </div>
    );
}
