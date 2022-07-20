/** @format */

import Head from "next/head";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import UserForm from "../../components/forms/UserForm";
import Title from "../../components/navigation/Title";

export default function Account({ user }) {
    return (
        <>
            <Head>
                <title>Edita tu Perfil</title>
            </Head>
            <Title>Edita tu perfil</Title>
            <UserForm user={user} />
        </>
    );
}

export const getServerSideProps = withPageAuthRequired({
    redirectTo: "/",
});
