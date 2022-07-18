/** @format */
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";
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
import Link from "next/link";
import BasicAuthorCard from "../items/AuthorCard/Basic";

const NavbarAuth = ({ user }) => (
  <nav
    className="
        flex flex-col
				space-y-6
        font-bold text-xl
        "
  >
    <Link href="/">
      <a className="flex items-center justify-center xl:justify-start pt-1">
        <div className="relative h-5 w-5">
          <Image
            src="/logo.svg"
            alt="Picture of the author"
            layout="fill"
            objectFit="fill"
            quality={10}
          />
        </div>
        <h1 className="pl-2 text-xl hidden xl:block">
          <span className="font-bold hover:text-blue-700">app</span>
          <span className="font-light">rendamos</span>
        </h1>
      </a>
    </Link>

    <Link href="/home">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <HomeIcon className="h-6 w-6 xl:mr-4" />
          <span className="hidden xl:block">Inicio</span>
        </div>
      </a>
    </Link>
    <Link href="/search">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <SearchIcon className="h-6 w-6 xl:mr-4" />
          <span className="hidden xl:block">Buscar</span>
        </div>
      </a>
    </Link>
    <Link href="/draft">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <PencilAltIcon className="h-6 w-6 xl:mr-4" />
          <span className="hidden xl:block">Crear</span>
        </div>
      </a>
    </Link>
    <Link href="/trending">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <TrendingUpIcon className="h-6 w-6 xl:mr-4" />
          <span className="hidden xl:block">Tendencias</span>
        </div>
      </a>
    </Link>
    <Link href="/saved">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <BookmarkIcon className="h-6 w-6 xl:mr-4" />
          <span className="hidden xl:block">Guardados</span>
        </div>
      </a>
    </Link>
    <Link href="/notifications">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <BellIcon className="h-6 w-6 xl:mr-4" />
          <span className="hidden xl:block">Notificaciones</span>
        </div>
      </a>
    </Link>
    {/* 
    <Link href="/messages">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <MailIcon className="h-6 w-6 xl:mr-4" />
          <span>Mensajes</span>
        </div>
      </a>
    </Link> */}
    <Link href="/settings/profile">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <CogIcon className="h-6 w-6 xl:mr-4" />
          <span className="hidden xl:block">Configuraciones</span>
        </div>
      </a>
    </Link>
    <div className="hidden xl:block">
      <BasicAuthorCard {...user} />
    </div>
    <Link href={`/@${user.username}`}>
      <a>
        <div className="xl:hidden relative h-10 w-10 rounded-full overflow-hidden border cursor-pointer">
          <Image
            src={user.picture}
            alt="Picture of the author"
            layout="fill"
            objectFit="fill"
            quality={10}
            
          />
        </div>
      </a>
    </Link>
  </nav>
);

const NavbarNoAuth = () => (
  <nav
    className="
        flex flex-col
				space-y-6
        font-bold text-xl"
  >
    <Link href="/">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <span className="font-bold hover:text-blue-700">app</span>
          <span className="font-light">rendamos</span>
        </div>
      </a>
    </Link>

    <Link href="/search">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <SearchIcon className="h-6 w-6 xl:mr-4" />
          <span>Buscar</span>
        </div>
      </a>
    </Link>
    <Link href="/trending">
      <a>
        <div className="flex items-center justify-center xl:justify-start">
          <TrendingUpIcon className="h-6 w-6 xl:mr-4" />
          <span>Tendencias</span>
        </div>
      </a>
    </Link>
    <Link href="/api/auth/login">
      <a>
        <button className="mr-4 px-4 h-10 rounded text-blue-700 border-2 border-blue-700">
          <span className="font-bold text-base">Inicia sesión</span>
        </button>
      </a>
    </Link>
  </nav>
);

const Navbar = () => {
  const { user } = useUser();

  if (user && user?.username) return <NavbarAuth user={user} />;
  return <NavbarNoAuth />;
};

export default Navbar;