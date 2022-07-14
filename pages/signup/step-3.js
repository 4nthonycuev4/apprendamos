import { useState, useEffect } from 'react';
import Head from 'next/head';
import useSWRInfinite from 'swr/infinite'
import InfiniteScroll from 'react-infinite-scroll-component';
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import PartialAuthorCard from './../../components/items/AuthorCard/Partial';

const FollowSomeonePage = ({ }) => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null
        if (pageIndex === 0) return '/api/users/trending'
        return `/api/users/trending?afterId=${previousPageData.afterId}`
    }
    const { data, size, setSize, error } = useSWRInfinite(getKey)

    const [contentSize, setContentSize] = useState(0)

    useEffect(() => {
        let n = 0;
        data?.forEach(page => {
            n += page.data?.length
        });
        setContentSize(n)
    }, [size])

    return (
        <>
            <Head>
                <title>Sigue a alguien para continuar || Apprendamos</title>
            </Head>
            <div>
                <h1>Follow Someone</h1>
                <p>
                    Follow someone to see their posts.
                </p>
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
                        data?.map(page => page.data?.map(item => item && <PartialAuthorCard key={item.id} {...item} />))
                    }
                </InfiniteScroll>
            </div></>

    );
}
export default withPageAuthRequired(FollowSomeonePage);