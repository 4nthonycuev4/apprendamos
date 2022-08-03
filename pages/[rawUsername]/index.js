/** @format */
import Head from "next/head";
import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";

import FaunaClient from "../../fauna";
import User404 from "../../components/errors/User404";
import { PublicationPartialView } from "../../components/items/PublicationPartialView";
import { FullAuthorCard } from "../../components/items/AuthorCard/Full";

const Profile = ({ userData }) => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null;
        if (pageIndex === 0)
            return `/api/authors/${userData.nickname}/publications`;
        return `/api/authors/${userData.nickname}/publications?afterId=${previousPageData.afterId}`;
    };
    const { data, size, setSize } = useSWRInfinite(getKey);

    const publications =
        data && data[0].data
            ? [].concat(...data.map((page) => [].concat(...page?.data)))
            : [];

    return (
        <>
            <Head>
                <title>{`${userData.name} (@${userData.nickname}) || Apprendamos`}</title>

                <meta property="og:image" content={userData.picture} />
                <meta
                    property="og:title"
                    content={`${userData.name} (@${userData.nickname}) || Apprendamos`}
                />
                <meta property="og:description" content={userData.about} />
                <meta property="og:url" content="apprendamos.com" />
                <meta property="og:type" content="website" />
                <meta property="fb:app_id" content="328834189100104" />
                <meta name="twitter:card" content="summary" />
            </Head>
            <FullAuthorCard {...userData} />
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
                            <PublicationPartialView
                                key={item.id}
                                {...item}
                                author={userData}
                            />
                        )
                )}
            </InfiniteScroll>
        </>
    );
};

const ProfilePageHandler = ({ userData, errorCode }) => {
    if (errorCode === 404) {
        return <User404 />;
    }
    return <Profile userData={userData} />;
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

        const user = await client.getSingleUser(nickname);

        return { props: { userData: user } };
    } catch (error) {
        console.log("error", error);
        return { props: { errorCode: error.requestResult.statusCode } };
    }
};

export default ProfilePageHandler;
export { getServerSideProps };
