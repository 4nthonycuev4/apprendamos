/** @format */
import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function memoramaOptionsPage() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const { username, memoramaId } = router.query;
  return (
    <>
      <Head>
        <title>Flasquiz</title>
      </Head>
      <div className="grid grid-cols-1 gap-2">
        <Link href={`/${username}/m/${memoramaId}`}>
          <button
            type="button"
            className="mx-32 rounded-lg border py-2 hover:bg-slate-100"
          >
            <a>Ir al memorama</a>{" "}
          </button>
        </Link>
        {!error && !isLoading && user?.username === username && (
          <Link href={`/${username}/m/${memoramaId}/update`}>
            <button
              type="button"
              className="mx-32 rounded-lg border py-2 hover:bg-slate-100"
            >
              <a>Editar o eliminar</a>{" "}
            </button>
          </Link>
        )}
        <Link href={`/${username}/m/${memoramaId}/report`}>
          <button
            type="button"
            className="mx-32 rounded-lg border py-2 hover:bg-slate-100"
          >
            <a>Denunciar</a>
          </button>
        </Link>
        <button
          type="button"
          className="mx-32 rounded-lg border py-2 hover:bg-slate-100"
          onClick={() => router.back()}
        >
          Atrás
        </button>
      </div>
    </>
  );
}
