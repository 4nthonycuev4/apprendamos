/** @format */

import Head from "next/head";

import memorama from "../../../../../components/items/memorama";
import Navbar from "../../../../../components/navigation/Navbar";
import FaunaClient from "../../../../../fauna";

export default function SinglememoramaPage({ memorama, author }) {
  return (
    <>
      <Head>
        <title>{`${author.name}'s memorama`}</title>
        <meta property="og:url" content="apprendamos.com" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="328834189100104" />
        <meta
          property="og:title"
          content={`${author.name}: ${memorama.title} || Apprendamos`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content={`${memorama.body.slice(0, 40)}... Apprendamos te permite compartir publicaciones y flashcards con los demás usuarios de la red. Regístrate y empieza a crear y compartir tu propia red de conocimiento.`}
        />
        <meta property="og:image" content={author.picture} />
      </Head>
      <Navbar title="memorama" />
      <Memorama memorama={memorama} author={author} />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { memoramaId } = context.params;

    const faunaClient = new FaunaClient();

    const { content, author } =
      await faunaClient.getSingleContentWithAuthor({
        collection: "memoramas",
        id: memoramaId,
      });

    return { props: { memorama: content, author: author } };
  } catch (error) {
    return { props: { errorCode: 500 } };
  }
}
