/** @format */

/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../../../../../components/navigation/Navbar";

import QuestionForm from "../../../../../components/forms/QuestionForm";
import FaunaClient from "../../../../../fauna";

export default function EditQuestionPage({ question, author }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Cargando...</div>;

  if ((!isLoading && !user) || user?.username !== author.username) {
    router.back();
  }

  return (
    <div>
      <Head>
        <title>Editar Pregunta</title>
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

      <Navbar title="Editar una pregunta" />
      <QuestionForm question={question} author={author} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { questionId } = context.query;
  const faunaClient = new FaunaClient();
  const res = await faunaClient.getSingleContentWithAuthor(
    {
      collection: "Questions",
      id: questionId,
    },
    0
  );

  return {
    props: {
      question: res.content,
      author: res.author,
    },
  };
}
