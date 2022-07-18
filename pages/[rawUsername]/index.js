/** @format */
import Head from "next/head";
import useSWRInfinite from 'swr/infinite';
import InfiniteScroll from 'react-infinite-scroll-component';

import FaunaClient from "../../fauna";
import User404 from '../../components/errors/User404';
import { PublicationPartialView } from "../../components/items/PublicationPartialView";
import { FullAuthorCard } from "../../components/items/AuthorCard/Full";

const Profile = ({ userData }) => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null
        if (pageIndex === 0) return `/api/users/${userData.username}/publications`
        return `/api/users/${userData.username}/publications?afterId=${previousPageData.afterId}`
    }
    const { data, size, setSize } = useSWRInfinite(getKey)

    let contentSize = 0;
    data?.forEach(page => {
        contentSize += page?.data?.length
    });

    return <>
        <Head>
            <title>{`${userData.name} (@${userData.username}) || Apprendamos`}</title>

            <meta property="og:image" content={userData.picture} />
            <meta
                property="og:title"
                content={`${userData.name} (@${userData.username}) || Apprendamos`}
            />
            <meta
                property="og:description"
                content={userData.about}
            />
            <meta property="og:url" content="apprendamos.com" />
            <meta property="og:type" content="website" />
            <meta property="fb:app_id" content="328834189100104" />
            <meta name="twitter:card" content="summary" />
        </Head>
        <FullAuthorCard {...userData} />
        {data && data.length && <InfiniteScroll
            scrollableTarget="main"
            dataLength={data?.length ? contentSize : 0}
            next={() => console.log('next')}
            hasMore={false}
            loader={<h1>Loading...</h1>}
            endMessage={
                <p className="text-center">
                    <b>Yay! You have seen it all :D</b>
                </p>
            }
        >
            {
                data?.map(page => page?.data?.map(item => item && <PublicationPartialView key={item.id} {...item} author={userData} />))
            }
        </InfiniteScroll>}
    </>
};


const ProfilePageHandler = ({ userData, errorCode }) => {
    if (errorCode === 404) {
        return <User404 />
    } return <Profile userData={userData} />
}

const getServerSideProps = async ({ query, resolvedUrl }) => {
    try {
        const { rawUsername } = query;
        const username = rawUsername.split('@')[1];

        if (!username) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/404?fromUrl=" + resolvedUrl,
                },
                props: {},
            }
        }

        const client = new FaunaClient();

        const user = await client.getSingleUser(username);


        return { props: { userData: user } }
    } catch (error) {
        console.log('error', error)
        return { props: { errorCode: error.requestResult.statusCode } }
    }
}

export default ProfilePageHandler;
export { getServerSideProps };