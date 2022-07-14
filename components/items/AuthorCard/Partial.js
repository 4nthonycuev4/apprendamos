/** @format */

import Image from "next/image";
import Link from "next/link";

import FollowButton from "../../buttons/Follow";

const PartialAuthorCard = ({ username, name, picture, about, isViewer }) => {
    return (
        <div className="flex items-center space-x-2">
            <div className="relative h-14 w-14">
                <Image
                    src={picture}
                    alt="Picture of the author"
                    layout="fill"
                    objectFit="fill"
                    className="rounded-full"
                />
            </div>
            <div>
                <h1 className="-my-0.5 space-x-2">
                    <span className="font-semibold">{name}</span>
                    <span className="font-normal dark:text-gray-300">{`@${username}`}</span>
                    {!isViewer ? <FollowButton username={username} /> : (<Link href={`/@${username}`}>
                        <a><button type="button"
                            className="h-6 w-20 rounded bg-green-500 text-xs font-semibold text-white"
                        >Ir al perfil</button></a></Link>)}
                </h1>
                <p>{about}</p>

            </div>
        </div>
    )
};

export default PartialAuthorCard;