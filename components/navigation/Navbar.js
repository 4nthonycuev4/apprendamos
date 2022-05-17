/** @format */

import {
  CollectionIcon,
  LoginIcon,
  LogoutIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import Link from "next/link";

export default function Navbar({ title }) {
  return (
    <nav
      className="
				sticky top-0 z-10 flex 
				items-center justify-between bg-gray-300
				px-4
				py-2
				text-gray-900
				dark:bg-gray-900
				dark:text-gray-300"
    >
      <h1 className="text-xl font-bold">{title}</h1>
      <Link href="/">
        <a className="flex text-center ">
          <CollectionIcon className="h-6 w-6" />
          <span className="pl-1 font-light">cards</span>
          <span className="font-bold">memo</span>
        </a>
      </Link>
    </nav>
  );
}
