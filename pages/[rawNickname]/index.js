/** @format */
import Head from "next/head";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";

import FaunaClient from "fauna";
import User404 from "components/errors/User404";
import { ItemPublication } from "components/items/Publication";
import { FullAuthorCard } from "components/items/AuthorCard/Full";

const AuthorProfilePage = ({ nickname, picture, name, about }) => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null;
        if (pageIndex === 0) return `/api/authors/${nickname}/publications`;
        return `/api/authors/${nickname}/publications?afterId=${previousPageData.afterId}`;
    };
    const { data, size, setSize } = useSWRInfinite(getKey);

    const publications =
        data && data[0].data
            ? [].concat(...data.map((page) => [].concat(...page?.data)))
            : [];

    return (
        <>
            <Head>
                <title>{`${name} (@${nickname}) || Apprendamos`}</title>

                <meta property="og:image" content={picture} />
                <meta
                    property="og:title"
                    content={`${name} (@${nickname}) || Apprendamos`}
                />
                <meta property="og:description" content={about} />
                <meta property="og:url" content="apprendamos.com" />
                <meta property="og:type" content="website" />
                <meta property="fb:app_id" content="328834189100104" />
                <meta name="twitter:card" content="summary" />
            </Head>
            <FullAuthorCard
                nickname={nickname}
                name={name}
                about={about}
                picture={picture}
            />
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
                {publications.map(
                    (item) =>
                        item && (
                            <ItemPublication
                                key={item.fref.id}
                                {...item}
                                author={{
                                    nickname,
                                    name,
                                    picture,
                                }}
                            />
                        )
                )}
            </InfiniteScroll>
        </>
    );
};

const AuthorProfilePageHandler = ({ userData, errorCode }) => {
    if (!errorCode && userData) {
        return <AuthorProfilePage {...userData} />;
    }
    if (errorCode === 404) {
        return <User404 />;
    } else {
        return <h1>Error</h1>;
    }
};

const getServerSideProps = async ({ query, resolvedUrl }) => {
    try {
        const { rawNickname } = query;
        const nickname = rawNickname.split("@")[1];

        if (!nickname) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/404?fromUrl=" + resolvedUrl,
                },
                props: {},
            };
        }

        const client = new FaunaClient();
        const user = await client.getSingleAuthor(nickname);
        return { props: { userData: user } };
    } catch (error) {
        return {
            props: {
                errorCode:
                    error.requestResult?.responseContent?.errors[0]?.cause[0]
                        ?.cause[0]?.code === "instance not found"
                        ? 404
                        : 500,
            },
        };
    }
};

export default AuthorProfilePageHandler;
export { getServerSideProps };
