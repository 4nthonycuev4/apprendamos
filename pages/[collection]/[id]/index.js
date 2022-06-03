/** @format */
import Head from "next/head";

import ContentRead from "../../../components/items/ContentRead";
import { ContentStatsButtons } from "../../../components/buttons/ContentStats";
import useSWR from 'swr';
import { useRouter } from 'next/router'

export default function SingleContentPage() {
  const router = useRouter();
  const { collection, id } = router.query;

  const { data: content, mutate } = useSWR(`/api/${collection}/${id}`)

  const setStats = (stats) => {
    mutate({ ...content, stats }, false)
  }

  const setViewerStats = (viewerStats) => {
    mutate({ ...content, viewerStats }, false)
  }

  if (!content?.author) {
    return <div>loading...</div>
  }
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
        <title>{`${content.author.username}'s content`}</title>
        <meta property="og:url" content="apprendamos.com" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="328834189100104" />
        <meta
          property="og:title"
          content={`${content.author.name}: ${content.title} || Apprendamos`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content={`${content.body.slice(0, 40)}... Apprendamos te permite compartir publicaciones y flashcards con los demás usuarios de la red. Regístrate y empieza a crear y compartir tu propia red de conocimiento.`}
        />
        <meta property="og:image" content={content.author.picture} />
      </Head>

      <ContentRead {...content} />
      <ContentStatsButtons contentId={content.id} stats={content.stats} setStats={setStats} viewerStats={content.viewerStats} setViewerStats={setViewerStats} />
    </>
  );
}