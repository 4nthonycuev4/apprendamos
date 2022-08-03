/** @format */

import { CalendarIcon } from "@heroicons/react/solid";
import moment from "moment";
import Image from "next/image";

import AuthorInteractions from "./../../AuthorInteractions";

export const FullAuthorCard = ({
    picture,
    nickname,
    name,
    joinedAt,
    about,
}) => (
    <div className="border-b border-gray-300 py-2 px-4 text-center dark:border-gray-500">
        <div className="flex relative h-20 w-20 rounded-full overflow-hidden border mx-auto">
            <Image
                src={picture}
                alt="Picture of the author"
                layout="fill"
                objectFit="fill"
                quality={20}
                priority
            />
        </div>
        <div className="text-center">
            <h1 className="text-xl font-bold">{name}</h1>
            <h1 className="text-md mb-2 font-normal">@{nickname}</h1>
        </div>
        <AuthorInteractions nickname={nickname} />
        <div className="itmes-center flex h-6 justify-center ">
            <div className="pt-[2px] pr-1">
                <CalendarIcon className="h-5 w-5" />
            </div>
            <h1 className="text-md font-normal">
                {moment(joinedAt).format("MMMM YYYY")}
            </h1>
        </div>
        <p className="py-2 italic">{about}</p>
    </div>
);
