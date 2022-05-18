/** @format */

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";

import FlashquizForm from "../../components/forms/FlashquizForm";
import Navbar from "../../components/navigation/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nuevo Flashquiz</title>
      </Head>
      <Navbar title="Crear un flasquiz" />
      <FlashquizForm />
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
