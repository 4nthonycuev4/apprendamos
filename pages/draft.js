import Head from "next/head";

import CreatePublicationForm from "../components/forms/CreatePublication";
import Title from "../components/navigation/Title";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const CreateQuestionPage = ({ user }) => (
    <>
        <Head>
            <title>Crear Pregunta</title>
        </Head>
        <Title>Crear publicación</Title>
        <CreatePublicationForm user={user} />
    </>
);

export const getServerSideProps = withPageAuthRequired();

export default CreateQuestionPage;
