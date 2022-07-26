import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import Title from "components/navigation/Title";
import { PublicationForm } from "components/Markdown";

const SinglePublicationDraftPage = ({ user }) => {
    const router = useRouter();
    const { id } = router.query;
    const [body, setBody] = useState("");
    const [saved, setSaved] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const { body } = await fetch(`/api/drafts/${id}`).then((res) =>
                res.json()
            );
            setBody(body);
            setSaved(true);
        };
        fetchData();
    }, [id]);

    const updatePublicationDraft = async () => {
        await fetch(`/api/drafts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ body }),
        });
        setSaved(true);
    };

    const publishPublicationDraft = async () => {
        await fetch(`/api/drafts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        router.push(`/p/${id}`);
    };

    return (
        <>
            <Head>
                <title>Crear Pregunta</title>
            </Head>
            <Title>@{user.username} draft</Title>
            <p>This is a draft page for @{user.username}</p>
            {body && body.length > 0 && (
                <>
                    <PublicationForm
                        content={body}
                        setContent={setBody}
                        setSaved={setSaved}
                    />
                    <div className="flex space-x-4 justify-end pt-2">
                        <button
                            type="button"
                            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded px-2 py-1 mr-1 font-semibold"
                        >
                            Descartar
                        </button>
                        {saved ? (
                            <button
                                type="submit"
                                className="border-2 border-blue-700 bg-blue-700 rounded w-32 py-1 text-gray-100 font-semibold"
                                onClick={publishPublicationDraft}
                            >
                                Publicar
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="border-2 border-blue-700 bg-blue-700 rounded w-32 py-1 text-gray-100 font-semibold"
                                onClick={updatePublicationDraft}
                            >
                                Actualizar
                            </button>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default SinglePublicationDraftPage;
export const getServerSideProps = withPageAuthRequired();
