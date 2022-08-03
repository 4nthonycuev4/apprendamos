import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";

import BaseModal from "./Base";
import BasicAuthorCard from "./../items/AuthorCard/Basic";

export default function FollowersModal({ nickname, followerCount }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null;
        if (pageIndex === 0) return `/api/authors/${nickname}/followers`;
        return `/api/authors/${nickname}/followers?afterId=${previousPageData.afterId}`;
    };
    const { data, size, setSize } = useSWRInfinite(getKey);

    const followers =
        data && data[0].data
            ? [].concat(...data?.map((page) => [].concat(...page?.data)))
            : [];

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                className="flex space-x-1"
            >
                <span className="font-black">{followerCount}</span>
                <span>Seguidores</span>
            </button>
            <BaseModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title={`Seguidores de ${nickname}`}
            >
                <InfiniteScroll
                    dataLength={followers.length}
                    next={() => setSize(size + 1)}
                    hasMore={data && Boolean(data[data.length - 1].afterId)}
                    loader={<h1>Loading...</h1>}
                    endMessage={
                        <p className="text-center">
                            <b>Yay! You have seen it all :D</b>
                        </p>
                    }
                    className="flex flex-col space-y-2"
                >
                    {data?.map((page) =>
                        page?.data?.map(
                            (item) =>
                                item && (
                                    <BasicAuthorCard key={item.id} {...item} />
                                )
                        )
                    )}
                </InfiniteScroll>
            </BaseModal>
        </>
    );
}
