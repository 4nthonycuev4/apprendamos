/** @format */
import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PostOptionsPage() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const { username, postId } = router.query;
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <div className="grid grid-cols-1 gap-2">
        <Link href={`/@/${username}/posts/${postId}`}>
          <button className="mx-32 rounded-lg border py-2 hover:bg-slate-100">
            <a>Ir al post</a>
          </button>
        </Link>
        {!error && !isLoading && user?.username === username && (
          <Link href={`/@/${username}/posts/${postId}/update`}>
            <button className="mx-32 rounded-lg border py-2 hover:bg-slate-100">
              <a className="w-full">Editar o eliminar</a>
            </button>
          </Link>
        )}

        <Link href={`/@/${username}/posts/${postId}/report`}>
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
