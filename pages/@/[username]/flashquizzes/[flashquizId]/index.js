/** @format */

import Head from "next/head";

import Flashquiz from "../../../../../components/items/Flashquiz";
import Navbar from "../../../../../components/navigation/Navbar";
import FaunaClient from "../../../../../fauna";

export default function SingleFlashquizPage({ flashquiz, author }) {
  return (
    <>
      <Head>
        <title>{`${author.name}'s flashquiz`}</title>
        <meta property="og:url" content="cardsmemo.com" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="328834189100104" />
        <meta
          property="og:title"
          content={`${author.name}: ${flashquiz.title} || Cardsmemo`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content={`${flashquiz.body.slice(0, 40)}... Cardsmemo te permite compartir publicaciones y flashcards con los demás usuarios de la red. Regístrate y empieza a crear y compartir tu propia red de conocimiento.`}
        />
        <meta property="og:image" content={author.picture} />
      </Head>
      <Navbar title="Flashquiz" />
      <Flashquiz flashquiz={flashquiz} author={author} />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { flashquizId } = context.params;

    const faunaClient = new FaunaClient();

    const { content, author } =
      await faunaClient.getSingleContentWithAuthor({
        collection: "Flashquizzes",
        id: flashquizId,
      });

    return { props: { flashquiz: content, author: author } };
  } catch (error) {
    return { props: { errorCode: 500 } };
  }
}
