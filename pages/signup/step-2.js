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
    <div>
      <Head>
        <title>Regístrate</title>
      </Head>


      <h1 className="mb-4 text-2xl">Regístrate</h1>
      <UserForm user={user} />

    </div>
  );
}
export const getServerSideProps = withPageAuthRequired();
