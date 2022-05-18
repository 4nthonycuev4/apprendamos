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
