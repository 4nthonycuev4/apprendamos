/** @format */

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";

import FlashquizForm from "../../components/forms/FlashquizForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nuevo Flashquiz</title>
      </Head>
      <h1 className="text-center text-2xl font-extrabold">Nuevo Flashquiz</h1>
      <FlashquizForm />
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
