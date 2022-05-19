/** @format */

import Head from "next/head";
import useSWR from "swr";

import Content from "../components/lists/Content";
import Navbar from "../components/navigation/Navbar";

export default function Home() {
  const { data: content } = useSWR("/api/content");

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
        <meta property="og:url" content="cardsmemo.com" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="your fb app id" />
        <meta
          property="og:title"
          content="Cardsmemo || La red social de información académica"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content="Cardsmemo te permite compartir publicaciones y flashcards con los demás usuarios de la red. Regístrate y empieza a crear y compartir tu propia red de conocimiento."
        />
        <meta property="og:image" content="https://res.cloudinary.com/cardsmemo/image/upload/v1652935086/app_src/ioo_pacwki.png" />
      </Head>
      <Navbar title="Inicio" />
      <Content content={content} />
    </>
  );
}
