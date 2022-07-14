/** @format */

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";

import UserForm from "../../components/forms/UserForm";

export default function Account({ user }) {
  return (
    <>
      <Head>
        <title>Edita tu Perfil</title>
      </Head>
      <UserForm user={user} />
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  redirectTo: "/",
});
