/** @format */

import Image from "next/image";
import Link from "next/link";

export default function BasicAuthorCard({ nickname, picture, name }) {
    return (
        <div className="flex items-center">
            <Link href={`/@${nickname}`}>
                <a>
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-300 mr-2.5">
                        <Image
                            src={picture}
                            alt="Picture of the author"
                            layout="fill"
                            objectFit="fill"
                        />
                    </div>
                </a>
            </Link>
            <div>
                <Link href={`/@${nickname}`}>
                    <a>
                        <h1 className="font-semibold text-sm -mb-1">{name}</h1>
                        <h1 className="font-normal text-sm dark:text-gray-300">{`@${nickname}`}</h1>
                    </a>
                </Link>
            </div>
        </div>
    );
}
