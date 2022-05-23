/** @format */

import Head from "next/head";
import { useState, useEffect } from "react";

import Content from "../components/lists/Content";
import Navbar from "../components/navigation/Navbar";

export default function HomePage() {
  const [content, setContent] = useState([]);
  const [afterRef, setAfterRef] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      const res = await fetch("/api/content")
        .then((res) => res.json())
        .catch((error) => {
          console.log("error", error);
          return null;
        });

      if (res) {
        setContent(res.data);
        setAfterRef(res.afterRef);
      }
    };
    fetchContent();
  }, []);

  const fetchMoreContent = async () => {
    const res = await fetch(`/api/content?afterId=${afterRef.id}&afterCollection=${afterRef.collection}`)
      .then((res) => res.json())
      .catch((error) => {
        console.log("error", error);
        return null;
      });

    if (res) {
      setContent(content.concat(res.data));
      setAfterRef(res.afterRef);
    }
  }

  return (
    <>
      <Head>
        <title>Apprendamos || Flashcards & articles</title>
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
          content="Apprendamos: Tu red de conocimiento"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content="Apprendamos te permite compartir publicaciones y flashcards con los demás usuarios de la red. Regístrate y empieza a crear y compartir tu propia red de conocimiento."
        />
        <meta property="og:image" content="https://res.cloudinary.com/apprendamos/image/upload/v1652936748/app_src/ioo_swpsqz.jpg" />
      </Head>
      <Navbar title="Inicio" />
      <Content content={content || []} />
      {
        afterRef &&
        <button className="w-32 bg-red-600 mx-auto" onClick={fetchMoreContent}>
          Mostrar más
        </button>
      }
    </>
  );
}
