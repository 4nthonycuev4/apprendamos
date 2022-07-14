/** @format */
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";

import CreatePublicationForm from "../components/forms/CreatePublication";
import Title from "../components/navigation/Title";

export default function CreateQuestionPage({ user }) {
  return (
    <>
      <Head>
        <title>Crear Pregunta</title>
      </Head>
      <Title>Crear publicación</Title>
      <CreatePublicationForm user={user} />
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
