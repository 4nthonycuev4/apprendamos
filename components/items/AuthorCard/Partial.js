/** @format */

import Image from "next/image";
import Link from "next/link";

import FollowButton from "../../buttons/Follow";

const PartialAuthorCard = ({ username, name, picture, about = "Marco Antonio Muñiz Rivera, más conocido cómo Marc Anthony, es un cantautor y actor puertorriqueño-estadounidense, cuyos temas van desde la salsa, pasando por el bolero, la balada y el pop.", isViewer }) => {
    return (
        <div>
            <div className="flex items-center">
                <Link href={`/@${username}`}>
                    <a>
                        <div className="relative h-10 w-10 rounded-full overflow-hidden border mr-2.5">
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
                    <Link href={`/@${username}`}>
                        <a>
                            <h1 className="font-semibold text-sm -mb-1">{name}</h1>
                            <h1 className="font-normal text-sm dark:text-gray-300">{`@${username}`}</h1>
                        </a>
                    </Link>
                </div>
            </div>
            <p>{about}</p>
        </div>
    )
};

export default PartialAuthorCard;