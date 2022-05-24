/** @format */

import Head from "next/head";
import useSWRInfinite from 'swr/infinite'

import { Content } from "../components/items/Content";
import Navbar from "../components/navigation/Navbar";

export default function HomePage() {
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.data) return null
    if (pageIndex === 0) return '/api/content'
    return `/api/content?afterId=${previousPageData.afterRef.id}&afterCollection=${previousPageData.afterRef.collection}`
  }
  const { data, size, setSize, error } = useSWRInfinite(getKey)

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

      {
        error ? <div className="mx-6">Hubo un error :(</div> :
          !data ? <div className="mx-6">Cargando ...</div> : (<>
            {data.map((page) => (
              page.data.map(item => <Content key={item.faunaRef.id} {...item} />)
            ))}
            <div className="h-20"></div>
            <div className="flex justify-center">
              <button className="w-32 h-8 bg-cyan-500 rounded text-white disabled:hidden" disabled={!data.at(-1)?.afterRef.id} onClick={() => setSize(size + 1)}>
                Mostrar más
              </button>
            </div></>)
      }
    </>
  );
}
