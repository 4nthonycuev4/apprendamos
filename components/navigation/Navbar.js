/** @format */
import { useRouter } from "next/router";
import {
  ArrowCircleLeftIcon,
} from "@heroicons/react/outline";

import Link from "next/link";
import Image from "next/image";
export default function Navbar({ title }) {
  const router = useRouter();
  return (
    <nav
      className="
				top-0 sticky z-50
        flex 
				items-center justify-between bg-gray-300
				px-4
				py-2
				text-gray-900
				dark:bg-gray-900
				dark:text-gray-300"
    >
      <div className="flex items-center space-x-2">
        <button onClick={() => router.back()}><ArrowCircleLeftIcon className="h-6 w-6" /></button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <Link href="/">
        <a>
          <div className="flex items-center ">

            <div className="relative h-8 w-8">
              <Image
                src="/logo.png"
                alt="logo"
                layout="fill"
                objectFit="fill"
              />
            </div>
            <span className="pl-1 font-bold">app</span>
            <span className="font-light">rendamos</span>
          </div>
        </a>
      </Link>
    </nav>
  );
}
