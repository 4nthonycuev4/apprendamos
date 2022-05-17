/** @format */

import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import useSWR from "swr";

import Content from "../components/lists/Content";
import Navbar from "../components/navigation/Navbar";

export default function Home() {
  const { user, isLoading } = useUser();

  const getUrl = () =>
    user && user.username
      ? `/api/content?username=${user.username}`
      : "/api/content";

  const { data: content } = useSWR(!isLoading ? getUrl() : null);

  if (isLoading || !content) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Head>
        <title>Cardsmemo || Flashcards & posts</title>
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
      <Navbar title="Inicio" />
      <Content content={content} showComments minimal />
    </>
  );
}
