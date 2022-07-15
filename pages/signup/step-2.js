/** @format */

import { useEffect } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";
import { useRouter } from "next/router";

import UserForm from "../../components/forms/UserForm";

export default function RegisterPage({ user }) {
  const router = useRouter();

  useEffect(() => {
    if (user.id) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <>
      <Head>
        <title>Registro Paso 2 || Apprendamos</title>
      </Head>
      <h1 className='text-2xl font-extrabold hover:text-blue-700 cursor-default'>Tu perfil</h1>
      <p className='pb-2'>
        ¡Completa tu perfil para poder iteractuar con los demás! Estos datos son importantes para que otros usuarios te conozcan.
      </p>
      <UserForm user={user} />
    </>
  );
}
export const getServerSideProps = withPageAuthRequired();
