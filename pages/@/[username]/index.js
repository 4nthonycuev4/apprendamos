/** @format */
import { useState, useEffect } from "react";
import Head from "next/head";
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useRouter } from 'next/router';

import FullAuthorCard from "../../../components/items/FullAuthorCard";
import { Content } from "../../../components/items/Content";

export default function Profile() {
  const router = useRouter();
  const { username } = router.query;

  const { data: user, error: fetchUserError, mutate: mutateUser } = useSWR(username && `/api/users/${username}`)

  const updateUser = (stats) => {
    mutateUser({ ...user, stats }, false)
  }


  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.data) return null;
    if (pageIndex === 0) return user?.username && `/api/users/${user.username}/content`;
    return `/api/users/${username}/content?after=${previousPageData.after}`;
  }
  const { data, size, setSize, error: fetchContentError } = useSWRInfinite(getKey)

  const [contentSize, setContentSize] = useState(0)

  useEffect(() => {
    let n = 0;
    data?.forEach(page => {
      n += page.data.length
    });
    setContentSize(n)
  }, [data])

  if (fetchUserError) {
    return <div>failed to load</div>
  }
  if (!user) {
    return <div>loading...</div>
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
      <FullAuthorCard {...user} updateUser={updateUser} />
      <InfiniteScroll
        scrollableTarget="main"
        dataLength={contentSize}
        next={() => setSize(size + 1)}
        hasMore={Boolean(data?.at(-1)?.after)}
        loader={<h1>Loading...</h1>}
        endMessage={
          <p className="text-center">
            <b>Yay! You have seen it all :D</b>
          </p>
        }
      >
        {
          data?.map(page => page.data.map(item => item && <Content key={item.id} {...item} author={user} />))
        }
      </InfiniteScroll>
    </>
  );
}