/** @format */
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import {
  LoginIcon,
  BookmarkIcon,
  SearchIcon,
  TrendingUpIcon,
  PencilAltIcon,
  HomeIcon,
  BellIcon,
  MailIcon,
  CogIcon
} from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import BasicAuthorCard from "../items/BasicAuthorCard";

export default function Navbar() {
  const { user, error, isLoading } = useUser();
  return (
    <nav
      className="
        flex flex-col
        w-max ml-auto mr-10
        justify-right
				py-2 space-y-6
        font-bold text-xl"
    >
      <Link href="/">
        <a>
          <div className="flex items-center ">
            <div className="relative h-8 w-8 mr-4">
              <Image
                src="/logo.png"
                alt="logo"
                layout="fill"
                objectFit="fill"
              />
            </div>
            <span className="font-bold">app</span>
            <span className="font-light">rendamos</span>
          </div>
        </a>
      </Link>

      <Link href="/home">
        <a>
          <div className="flex items-center">
            <HomeIcon className="h-6 w-6 mr-4" />
            <span>Inicio</span>
          </div>
        </a>
      </Link>
      <Link href="/search">
        <a>
          <div className="flex items-center">
            <SearchIcon className="h-6 w-6 mr-4" />
            <span>Buscar</span>
          </div>
        </a>
      </Link>
      <Link href="/create">
        <a>
          <div className="flex items-center">
            <PencilAltIcon className="h-6 w-6 mr-4" />
            <span>Crear</span>
          </div>
        </a>
      </Link>
      <Link href="/trending">
        <a>
          <div className="flex items-center">
            <TrendingUpIcon className="h-6 w-6 mr-4" />
            <span>Tendencias</span>
          </div>
        </a>
      </Link>
      <Link href="/saved">
        <a>
          <div className="flex items-center">
            <BookmarkIcon className="h-6 w-6 mr-4" />
            <span>Guardados</span>
          </div>
        </a>
      </Link>
      <Link href="/notifications">
        <a>
          <div className="flex items-center">
            <BellIcon className="h-6 w-6 mr-4" />
            <span>Notificaciones</span>
          </div>
        </a>
      </Link>
      <Link href="/messages">
        <a>
          <div className="flex items-center">
            <MailIcon className="h-6 w-6 mr-4" />
            <span>Mensajes</span>
          </div>
        </a>
      </Link>
      <Link href="/settings">
        <a>
          <div className="flex items-center">
            <CogIcon className="h-6 w-6 mr-4" />
            <span>Configuraciones</span>
          </div>
        </a>
      </Link>
      {!error && !isLoading && user?.id ? (
        <BasicAuthorCard {...user} />
      ) : (
        <Link href="/api/auth/login">
          <a>
            <div className="flex items-center">
              <LoginIcon className="h-6 w-6 mr-4" />
              <span>Iniciar sesión</span>
            </div>
          </a>
        </Link>
      )}
    </nav>
  );
}
