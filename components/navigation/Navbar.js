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
import BasicAuthorCard from "../items/AuthorCard/Basic";

const NavbarAuth = ({ user }) => (
  <nav
    className="
        flex flex-col
				space-y-6
        font-bold text-xl"
  >
    <Link href="/">
      <a>
        <div className="flex items-center ">
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
    <Link href="/draft">
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
    <BasicAuthorCard {...user} />
  </nav>
);

const NavbarNoAuth = () => (
  <nav
    className="
        flex flex-col
				py-4 space-y-6
        font-bold text-xl
        overflow-y-auto"
  >
    <Link href="/">
      <a>
        <div className="flex items-center ">
          <span className="font-bold">app</span>
          <span className="font-light">rendamos</span>
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
    <Link href="/trending">
      <a>
        <div className="flex items-center">
          <TrendingUpIcon className="h-6 w-6 mr-4" />
          <span>Tendencias</span>
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
  </nav>
);

const Navbar = () => {
  const { user } = useUser();

  if (user && user?.username) return <NavbarAuth user={user} />;
  return <NavbarNoAuth />;
};

export default Navbar;