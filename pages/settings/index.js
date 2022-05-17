/** @format */

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";

import UserForm from "../../components/forms/UserForm";
import Navbar from "../../components/navigation/Navbar";

export default function Account({ user }) {
  return (
    <>
      <Head>
        <title>Edita tu Perfil</title>
      </Head>
      <Navbar title="Edita tu Perfil" />
      <UserForm user={user} />
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  redirectTo: "/",
});
