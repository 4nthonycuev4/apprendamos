/** @format */

import Head from "next/head";
import useSWR from "swr";

import Content from "../components/lists/Content";
import Navbar from "../components/navigation/Navbar";

export default function Home() {


  const { data: content } = useSWR("/api/content");

  if (!content) {
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
      <Content content={content} />
    </>
  );
}
