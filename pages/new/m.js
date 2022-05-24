/** @format */

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";

import MemoramaForm from "../../components/forms/MemoramaForm";
import Navbar from "../../components/navigation/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nuevo memorama</title>
      </Head>
      <Navbar title="Crear un flasquiz" />
      <MemoramaForm />
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
