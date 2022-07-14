/** @format */

import Head from "next/head";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";

import useDarkMode from "../hooks/useDarkMode";

export default function MorePage() {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);

  return (
    <>
      <Head>
        <title>Bienvenido a Apprendamos</title>
      </Head>
      <div className="grid grid-cols-1 gap-3">
        <Link href="/api/auth/logout">
          <a>
            <button type="button" className="text-xl font-bold">
              Cerrar sesión
            </button>
          </a>
        </Link>
        <Link href="/about">
          <a>
            <button type="button" className="text-xl font-bold">
              Acerca de
            </button>
          </a>
        </Link>
      </div>
      <div className="mt-4 flex border-t border-slate-300 py-2">
        <h1 className="text-xl font-bold">Cambiar tema: </h1>
        <button type="button" className="px-4" onClick={handleMode}>
          {darkTheme ? (
            <MoonIcon className="h-6 w-6" />
          ) : (
            <SunIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  );
}
