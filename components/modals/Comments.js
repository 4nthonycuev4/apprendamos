import { useState, useEffect } from 'react'
import Image from 'next/image';
import useSWRInfinite from 'swr/infinite'
import { useUser } from '@auth0/nextjs-auth0';
import { PaperAirplaneIcon as PaperAirplaneIconOutline, AnnotationIcon as AnnotationIconOutline } from "@heroicons/react/outline";
import { PaperAirplaneIcon as PaperAirplaneIconSolid, AnnotationIcon as AnnotationIconSolid } from "@heroicons/react/solid";

import Comment from "../items/Comment";
import BaseModal from './Base';


export default function CommentsModal({ contentId, viewerComment, commentCount }) {
    const [commentCountUpdated, setCommentCountUpdated] = useState(commentCount);
    const { user } = useUser();
    const htmlId = `commentInput${contentId}`;

    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true)

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null
        if (pageIndex === 0) return `/api/${contentId}/comments`
        return `/api/${contentId}/comments?afterId=${previousPageData.afterRef.id}`
    }
    const { data, size, setSize, error, mutate } = useSWRInfinite(getKey)

    const [isCreatingComment, setIsCreatingComment] = useState(false);
    const [createCommentError, setCreateCommentError] = useState(null);

    useEffect(() => {
        if (createCommentError) {
            setTimeout(() => {
                setCreateCommentError(null);
            }, 5000);
        }
    }, [createCommentError]);

    const handleSubmit = () => {
        setIsCreatingComment(true);

        const message = document.getElementById(htmlId).innerText;

        if (message.length < 5) {
            setCreateCommentError("El comentario debe tener al menos 5 caracteres");
        } else if (message.length > 280) {
            setCreateCommentError("El comentario no debe tener más de 280 caracteres");
        } else {
            document.getElementById(htmlId).innerText = "";
            createComment(message);
        }

        setIsCreatingComment(false);
    };

    const createComment = async (message) => {
        await fetch(`/api/${contentId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
            }),
        }).then((res) => res.json());
        mutate()
        setCommentCountUpdated(commentCount + 1);
    };

    return (
        <>
            <div className="flex">
                <button type="button" onClick={handleOpen}>
                    {viewerComment ? (
                        <AnnotationIconSolid className="w-5" />
                    ) : (
                        <AnnotationIconOutline strokeWidth={1.5} className="w-5" />
                    )}
                </button>
                <span>{commentCountUpdated}</span>
            </div>

            <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} title="Comentarios">
                <div className="flex w-full items-start mb-4">
                    <div className="flex-none w-max mr-4">
                        <div className="relative h-10 w-10">
                            <Image
                                src={user?.picture || '/ru1.png'}
                                alt="Picture of the author"
                                layout="fill"
                                objectFit="fill"
                                className="rounded-full"
                            />
                        </div>
                    </div>
                    <div className="flex grow w-48">
                        <span
                            id={htmlId}
                            type="text"
                            className="
                            w-full
							whitespace-pre-wrap 
                            border-0 border-b-2 border-gray-200  bg-gray-100 p-0 
							
							text-gray-800
                            dark:text-white
							empty:before:text-gray-400
							
							empty:before:content-['Agrega_un_comentario...']
							focus:border-gray-400

							focus:ring-0 
							dark:border-gray-600
							dark:bg-gray-800 

							dark:empty:before:text-gray-500
							border-none
							"
                            contentEditable={true}
                        />
                    </div>

                    <div className="flex-none w-max justify-end">
                        <button
                            type="button"
                            disabled={isCreatingComment || createCommentError}
                            onClick={handleSubmit}
                            className="mt-2 text-blue-500 disabled:text-gray-400"
                        >
                            <PaperAirplaneIconOutline className="w-5" />
                        </button>
                    </div>
                </div>
                {createCommentError && (
                    <div className="text-red-500 text-sm">{createCommentError}</div>
                )}
                {
                    error ? <div className="mx-6">Hubo un error :(</div> :
                        !data ? <div className="mx-6">Cargando ...</div> : data[0].data.length < 1 ? <h1>Sin comentarios</h1> : (<>
                            {data.map((page) => (
                                page.data.map(item => <Comment key={item.id} {...item} />
                                )))}
                            {data.at(-1)?.afterRef && <div className="flex justify-center">
                                <button className="w-32 h-8 bg-cyan-500 rounded text-white disabled:hidden" onClick={() => setSize(size + 1)}>
                                    Mostrar más
                                </button>
                            </div>}</>)
                }
            </BaseModal>
        </>
    )
}
