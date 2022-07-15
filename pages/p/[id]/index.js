/** @format */
import Head from "next/head";
import { useState } from "react";
import FaunaClient from '../../../fauna';
import { MDParsed } from "../../../components/Markdown";
import Publication404 from '../../../components/errors/Publication404';
import PartialAuthorCard from "../../../components/items/AuthorCard/Partial";
import { useUser } from '@auth0/nextjs-auth0';

const PublicationPage = ({ publicationOldData }) => {
    const { user } = useUser();
    const isViewer = user ? user.username === publicationOldData.author.username : false;
    const [publication, setPublication] = useState(publicationOldData);

    const setStats = (stats) => {
        setPublication({
            ...publication,
            stats
        });
    };

    const setViewerStats = (stats) => {
        setPublication({
            ...publication,
            viewerStats: stats
        });
    };
    return (
        <>
            <Head>
                <title>{`@${publicationOldData.author.username}: ${publicationOldData.body.slice(2, 20)}...`}</title>
                <meta property="og:url" content="apprendamos.com" />
                <meta property="og:type" content="website" />
                <meta property="fb:app_id" content="328834189100104" />
                <meta
                    property="og:title"
                    content={`${publicationOldData.author.name}: ${publicationOldData.body} || Apprendamos`}
                />
                <meta name="twitter:card" content="summary" />
                <meta
                    property="og:description"
                    content={`${publicationOldData.body}... Apprendamos te permite compartir publicaciones con los demás usuarios de la red. Regístrate y empieza a crear y compartir tu propia red de conocimiento.`}
                />
                <meta property="og:image" content={publicationOldData.author.picture} />
            </Head>
            <PartialAuthorCard {...publicationOldData.author} isViewer={isViewer} />
            <MDParsed body={publication.body} />
        </>
    );
}

const getServerSideProps = async ({ query, resolvedUrl }) => {
    try {
        const { id } = query;
        const client = new FaunaClient();
        const publicationData = await client.getPublication(id);
        return {
            props: {
                publicationData
            },
        };
    } catch (error) {
        if (error.requestResult.statusCode === 400) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/400?fromUrl=" + resolvedUrl,
                },
                props: {},
            }
        }
        return { props: { errorCode: error.requestResult.statusCode } }
    };
}


const PublicationPageHandler = ({ publicationData, errorCode }) => {
    if (errorCode === 404) {
        return <Publication404 />
    } return <PublicationPage publicationOldData={publicationData} />
}

export default PublicationPageHandler;
export { getServerSideProps };