/** @format */
import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ArticleOptionsPage() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const { username, articleId } = router.query;
  return (
    <>
      <Head>
        <title>Article</title>
      </Head>
      <div className="grid grid-cols-1 gap-2">
        <Link href={`/${username}/a/${articleId}`}>
          <button className="mx-32 rounded-lg border py-2 hover:bg-slate-100">
            <a>Ir al article</a>
          </button>
        </Link>
        {!error && !isLoading && user?.username === username && (
          <Link href={`/${username}/a/${articleId}/update`}>
            <button className="mx-32 rounded-lg border py-2 hover:bg-slate-100">
              <a className="w-full">Editar o eliminar</a>
            </button>
          </Link>
        )}

        <Link href={`/${username}/a/${articleId}/report`}>
          <button className="mx-32 rounded-lg border py-2 hover:bg-slate-100">
            <a>Denunciar</a>
          </button>
        </Link>
        <button
          className="mx-32 rounded-lg border py-2 hover:bg-slate-100"
          onClick={() => router.back()}
        >
          Atrás
        </button>
      </div>
    </>
  );
}
