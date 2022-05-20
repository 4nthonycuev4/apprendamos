/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import {
  BellIcon,
  LoginIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  TrendingUpIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const { user, error, isLoading } = useUser();

  return (
    <footer
      className="
        bottom-0 sticky z-50
        h-14
        grid grid-cols-5 justify-center
				bg-gray-300
				text-gray-900
				dark:bg-gray-900
				dark:text-gray-300"
    >
      <Link href="/">
        <a className="flex items-center justify-center">
          <button type="button" className="px-4">
            <TrendingUpIcon className="h-6 w-6" />
          </button>
        </a>
      </Link>
      <Link href="/search">
        <a className="flex items-center justify-center">
          <button type="button" className="px-4">
            <SearchIcon className="h-6 w-6" />
          </button>
        </a>
      </Link>
      <Link href="/new">
        <a className="flex items-center justify-center">
          <button type="button" className="px-4">
            <PlusIcon className="h-6 w-6" />
          </button>
        </a>
      </Link>
      {!error && !isLoading && user?.ref ? (
        <Link href={`/@/${user.username}`}>
          <a className="flex items-center justify-center">
            <div className="relative h-10 w-10">
              <Image
                src={user.picture}
                alt="Picture of the author"
                layout="fill"
                objectFit="fill"
                className="rounded-full"
              />
            </div>
          </a>
        </Link>
      ) : (
        <Link href="/api/auth/login">
          <a className="flex items-center justify-center">
            <button type="button" className="px-4">
              <LoginIcon className="h-6 w-6" />
            </button>
          </a>
        </Link>
      )}
      <Link href="/more">
        <a className="flex items-center justify-center">
          <button type="button" className="px-4">
            <MenuIcon className="h-6 w-6" />
          </button>
        </a>
      </Link>
    </footer>
  );
}
