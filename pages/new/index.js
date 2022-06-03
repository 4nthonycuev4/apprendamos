/** @format */

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";


export default function CreatePage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Apprendamos</title>
      </Head>
      <div className="mt-2 flex flex-col space-y-2 px-20">
        <Link href="/new/article">
          <a className="flex justify-center rounded-lg border py-2">
            <button type="button">Crear article</button>
          </a>
        </Link>
        <Link href="/new/memorama">
          <a className="flex justify-center border">
            <button type="button" className="rounded-lg  py-2">
              Crear memorama
            </button>
          </a>
        </Link>
        <Link href="/new/question">
          <a className="flex justify-center border">
            <button type="button" className="rounded-lg  py-2">
              Crear pregunta
            </button>
          </a>
        </Link>
        <button
          className="rounded-lg border py-2"
          type="button"
          onClick={() => router.back()}
        >
          Atrás
        </button>
      </div>
    </>
  );
}
