/** @format */

import Head from "next/head";

import Article from "../../../components/items/Article";
import Navbar from "../../../components/navigation/Navbar";
import FaunaClient from "../../../fauna";

export default function PostPage({ article, author }) {
  return (
    <>
      <Head>
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
        <title>{`${author.username}'s post`}</title>
        <meta property="og:url" content="apprendamos.com" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="328834189100104" />
        <meta
          property="og:title"
          content={`${author.name}: ${article.title} || Apprendamos`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content={`${article.bodyMD.slice(0, 40)}... Apprendamos te permite compartir publicaciones y flashcards con los demás usuarios de la red. Regístrate y empieza a crear y compartir tu propia red de conocimiento.`}
        />
        <meta property="og:image" content={author.picture} />
      </Head>
      <Navbar title="Post" />

      <Article {...article} author={author} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { articleId } = context.query;
  const faunaClient = new FaunaClient();
  const { content, author } = await faunaClient.getSingleContent({
    collection: "articles",
    id: articleId,
  });

  console.log('content', content)

  return {
    props: {
      article: content,
      author: author,
    },
  };
}
