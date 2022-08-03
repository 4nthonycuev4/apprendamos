import Head from "next/head";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import InfiniteScroll from "react-infinite-scroll-component";

import BasicAuthorCard from "../../components/items/AuthorCard/Basic";
import FollowButton from "../../components/buttons/Follow";
import Title from "../../components/navigation/Title";

const FollowSomeonePage = ({ user }) => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null;
        if (pageIndex === 0) return "/api/authors/trending";
        return `/api/authors/trending?afterId=${previousPageData.afterId}`;
    };
    const { data, size, setSize } = useSWRInfinite(getKey);

    const authors =
        data && data[0].data
            ? [].concat(...data?.map((page) => [].concat(...page?.data)))
            : [];

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
                dataLength={authors.length}
                next={() => setSize(size + 1)}
                hasMore={data && Boolean(data[data.length - 1].afterId)}
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
                            (author) =>
                                author && (
                                    <div className="border p-2 hover:bg-gray-50 rounded flex space-x-2 items-center">
                                        <BasicAuthorCard {...author} />
                                        <FollowButton
                                            nickname={author.nickname}
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
