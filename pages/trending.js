/** @format */

import Head from "next/head";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";

import { PublicationPartialView } from "./../components/items/PublicationPartialView";
import Title from "../components/navigation/Title";

export default function TrendingContentPage() {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null;
        if (pageIndex === 0) return "/api/publications/trending";
        return `/api/publications/trending?afterId=${previousPageData.afterId}`;
    };
    const { data, size, setSize } = useSWRInfinite(getKey);

    const publications =
        data && data[0].data
            ? [].concat(...data?.map((page) => [].concat(...page?.data)))
            : [];

    return (
        <>
            <Head>
                <title>Tendencias en Apprendamos</title>
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
                <meta
                    property="og:image"
                    content="https://res.cloudinary.com/apprendamos/image/upload/v1652936748/app_src/ioo_swpsqz.jpg"
                />
            </Head>
            <Title>Tendencias</Title>
            <InfiniteScroll
                dataLength={publications.length}
                next={() => setSize(size + 1)}
                hasMore={data && Boolean(data[data.length - 1].afterId)}
                loader={<h1>Loading...</h1>}
                endMessage={
                    <p className="text-center">
                        <b>Yay! You have seen it all :D</b>
                    </p>
                }
            >
                {publications?.map(
                    (item) =>
                        item && (
                            <PublicationPartialView key={item.id} {...item} />
                        )
                )}
            </InfiniteScroll>
        </>
    );
}
