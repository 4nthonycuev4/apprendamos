/** @format */

/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import { useRouter } from "next/router";

import ArticleForm from "../../../components/forms/ArticleForm";
import FaunaClient from "../../../fauna";

export default function EditArticlePage({ article, author }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Cargando...</div>;

  if ((!isLoading && !user) || user?.username !== author.username) {
    router.back();
  }

  return (
    <div>
      <Head>
        <title>Editar Article</title>
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
      </Head>
      <ArticleForm article={article} author={author} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { articleId } = context.query;
  const faunaClient = new FaunaClient();
  const res = await faunaClient.getSingleContentWithAuthor(
    {
      collection: "Articles",
      id: articleId,
    },
    0
  );

  return {
    props: {
      article: res.content,
      author: res.author,
    },
  };
}
