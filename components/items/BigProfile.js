/** @format */

import { CalendarIcon } from "@heroicons/react/solid";
import moment from "moment";
import Image from "next/image";

import AuthorStats from "../AuthorStats";

export default function BigProfile({ profile }) {
  return (
    <div className="border-b-2 border-gray-300 py-2 px-4 text-center dark:border-gray-500">
      <Image
        width={100}
        height={100}
        src={profile.picture}
        alt="Picture of the user"
        className="rounded-full"
      />
      <div className="text-center">
        <h1 className="text-xl font-bold">{profile.name}</h1>
        <h1 className="text-md mb-2 font-normal">@{profile.username}</h1>
      </div>
      <AuthorStats username={profile.username} startStats={profile.stats} />
      <div className="itmes-center flex h-6 justify-center ">
        <div className="pt-[2px] pr-1">
          <CalendarIcon className="h-5 w-5" />
        </div>
        <h1 className="text-md font-normal">
          {moment(profile.joined).format("MMMM YYYY")}
        </h1>
      </div>
      <p className="py-2 italic">{profile.about}</p>
    </div>
  );
}
