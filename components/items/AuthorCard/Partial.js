/** @format */

import Image from "next/image";
import Link from "next/link";

import FollowButton from "../../buttons/Follow";

const PartialAuthorCard = ({ username, name, picture, about, isViewer }) => {
    return (
        <div className="flex">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border mr-2">
                <Image
                    src={picture}
                    alt="Picture of the author"
                    layout="fill"
                    objectFit="fill"
                    quality={10}
                    priority
                />
            </div>
            <div className="w-60">
                <h1 className="space-x-2 font-semibold">{name}</h1>
                <h1 className="space-x-2 text-gray-800">{`@${username}`}</h1>
                {!isViewer ? <FollowButton username={username} /> : (
                    <Link href={`/@${username}`}>
                        <a>
                            <button
                                type="button"
                                className="h-6 w-20 rounded bg-green-500 text-xs font-semibold text-white"
                            >
                                Ir al perfil
                            </button>
                        </a>
                    </Link>)}
                <p className="italic text-gray-700 text-sm font-extralight">&quot;{about}&quot;</p>

            </div>
        </div>
    )
};

export default PartialAuthorCard;