/** @format */

/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import { useRouter } from "next/router";

import MemoramaForm from "../../../components/forms/MemoramaForm";
import FaunaClient from "../../../fauna";
import Navbar from "../../../components/navigation/Navbar";

export default function EditmemoramaPage({ memorama, author }) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Cargando...</div>;

  if ((!isLoading && !user) || user?.username !== author.username) {
    router.back();

    return <div>Cargando...</div>;
  }

  return (
    <>
      <Head>
        <title>Editar memorama</title>
      </Head>

      <Navbar title="Editar un memorama" />
      <MemoramaForm memorama={memorama} author={author} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { memoramaId } = context.query;
  const faunaClient = new FaunaClient();

  const res = await faunaClient.getSingleContentWithAuthor(
    {
      collection: "memoramas",
      id: memoramaId,
    },
    0
  );

  return {
    props: {
      memorama: res.content,
      author: res.author,
    },
  };
}
