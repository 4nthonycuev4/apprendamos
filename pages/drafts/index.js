import { useState } from "react";
import Head from "next/head";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

import Title from "../../components/navigation/Title";
import { PublicationForm } from "./../../components/Markdown";

const CreatePublicationDraftPage = ({ user }) => {
    const [body, setBody] = useState("");
    const router = useRouter();

    const createDraft = async () => {
        const id = await fetch(`/api/drafts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                body,
            }),
        }).then((res) => res.json());
        router.push(`/drafts/${id}`);
    };

    return (
        <>
            <Head>
                <title>Crear Pregunta</title>
            </Head>
            <Title>@{user.nickname} draft</Title>
            <p>This is a draft page for @{user.nickname}</p>
            <PublicationForm content={body} setContent={setBody} />
            <div className="flex space-x-4 justify-end pt-2">
                <button
                    type="submit"
                    className="border-2 border-blue-700 bg-blue-700 rounded px-2 py-1 text-gray-100 font-semibold"
                    onClick={createDraft}
                >
                    Crear borrador
                </button>
            </div>
        </>
    );
};

export default CreatePublicationDraftPage;
export const getServerSideProps = withPageAuthRequired();
