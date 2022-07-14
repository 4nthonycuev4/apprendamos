import { useState, useEffect } from 'react'
import useSWRInfinite from 'swr/infinite'
import InfiniteScroll from 'react-infinite-scroll-component';

import BaseModal from './Base';
import PartialAuthorCard from '../items/AuthorCard/Partial';

export default function FollowersModal({ username, followerCount }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true)

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null
        if (pageIndex === 0) return `/api/users/${username}/followers`
        return `/api/users/${username}/followers?afterId=${previousPageData.afterId}`
    }
    const { data, size, setSize } = useSWRInfinite(getKey)

    const [contentSize, setContentSize] = useState(0)

    useEffect(() => {
        let n = 0;
        data?.forEach(page => {
            n += page?.data?.length
        });
        setContentSize(n)
    }, [data])

    return (
        <>
            <button type="button" onClick={handleOpen} className="flex space-x-1">
                <span className="font-black">{followerCount}</span>
                <span>Seguidores</span>
            </button>
            <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} title={`Seguidores de @${username}`}>
                <InfiniteScroll
                    scrollableTarget="main"
                    dataLength={contentSize}
                    next={() => setSize(size + 1)}
                    hasMore={Boolean(data?.at(-1)?.afterId)}
                    loader={<h1>Loading...</h1>}
                    endMessage={
                        <p className="text-center">
                            <b>Yay! You have seen it all :D</b>
                        </p>
                    }
                >
                    {
                        data?.map(page => page?.data?.map(item => item && <PartialAuthorCard key={item.id} {...item} />))
                    }
                </InfiniteScroll>
            </BaseModal>
        </>
    )
}
