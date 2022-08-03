import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import InfiniteScroll from "react-infinite-scroll-component";

import PartialAuthorCard from "../../components/items/AuthorCard/Partial";
import Title from "../../components/navigation/Title";

const FollowSomeonePage = ({ user }) => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null;
        if (pageIndex === 0) return "/api/users/trending";
        return `/api/users/trending?afterId=${previousPageData.afterId}`;
    };
    const { data, size, setSize, error } = useSWRInfinite(getKey);

    const [contentSize, setContentSize] = useState(0);

    useEffect(() => {
        let n = 0;
        data?.forEach((page) => {
            n += page.data?.length;
        });
        setContentSize(n);
    }, [size, data]);

    return (
        <>
            <Head>
                <title>Registro Paso 3 || Apprendamos</title>
            </Head>

            <Title>Ahora sigamos a alguien...</Title>
            <p className="pb-2">
                ¡Sigue a nuestros usuarios más populares para ver sus posts!
            </p>

            <InfiniteScroll
                scrollableTarget="main"
                dataLength={contentSize}
                next={() => setSize(size + 1)}
                hasMore={Boolean(data?.at(-1)?.after)}
                loader={<h1>Loading...</h1>}
                endMessage={
                    <p className="text-center text-gray-600">
                        <b>Yay! You have seen it all :D</b>
                    </p>
                }
            >
                <div className="grid grid-cols-2 gap-2">
                    {data?.map((page) =>
                        page.data?.map(
                            (item) =>
                                item && (
                                    <div className="border p-2 hover:bg-gray-50 rounded">
                                        <PartialAuthorCard
                                            key={item.id}
                                            {...item}
                                            isViewer={
                                                item.nickname === user.nickname
                                            }
                                        />
                                    </div>
                                )
                        )
                    )}
                </div>
            </InfiniteScroll>
            <div className="text-right">
                <button className="border-2 border-blue-700 text-blue-700 rounded px-2 py-1 mr-4 font-semibold">
                    Cargar más
                </button>
                <Link href="/api/auth/login">
                    <button className="border-2 border-blue-700 bg-blue-700 rounded px-2 py-1 text-gray-100 font-semibold">
                        Finalizar
                    </button>
                </Link>
            </div>
        </>
    );
};

export const getServerSideProps = withPageAuthRequired();
export default FollowSomeonePage;
