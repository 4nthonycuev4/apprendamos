/** @format */

import Error from "next/error";
import Head from "next/head";

import BigProfile from "../components/items/BigProfile";
import Content from "../components/lists/Content";
import Navbar from "../components/navigation/Navbar";
import FaunaClient from "../fauna";

export default function Profile({ user, content, errorCode, errorMessage }) {
  if (errorCode) {
    return <Error statusCode={errorCode} title={errorMessage} />;
  }

  return (
    <>
      <Head>
        <title>
          {user.name} (@{user.username})
        </title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css"
          integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB"
          crossOrigin="anonymous"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js"
          integrity="sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p"
          crossOrigin="anonymous"
        />
        <meta property="og:url" content="apprendamos.com" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="328834189100104" />
        <meta
          property="og:title"
          content={`${user.name} (@${user.username}) || Apprendamos`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content={`${user.about.slice(0, 40)}... Apprendamos te permite compartir publicaciones y flashcards con los demás usuarios de la red. Regístrate y empieza a crear y compartir tu propia red de conocimiento.`}
        />
        <meta property="og:image" content={user.picture} />
      </Head>
      <Navbar title={`@${user.username}`} />
      <BigProfile profile={user} />
      <Content content={content.data} author={user} />
    </>
  );
}

export async function getServerSideProps(context) {

  const { username } = context.params;

  const client = new FaunaClient();

  const { user, content } = await client.getUserWithContent(username);
  if (!user) {
    return { props: { errorCode: 404, errorMessage: "User not found" } };
  }

  return {
    props: {
      user,
      content,
    },
  };
}
