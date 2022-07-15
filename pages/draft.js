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
      <h1 className='text-2xl font-extrabold hover:text-blue-700 cursor-default'>Crear publicación</h1>
      <CreatePublicationForm user={user} />
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
