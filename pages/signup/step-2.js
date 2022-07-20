/** @format */

import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import UserForm from "../../components/forms/UserForm";
import Title from "../../components/navigation/Title";

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
            <Title>Crea tu perfil</Title>
            <p className="pb-2">
                ¡Completa tu perfil para poder iteractuar con los demás! Estos
                datos son importantes para que otros usuarios te conozcan.
            </p>
            <UserForm user={user} />
        </>
    );
}
