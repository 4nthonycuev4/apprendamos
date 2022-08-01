import { useState, useEffect } from "react";
import Image from "next/image";
import useSWRInfinite from "swr/infinite";
import { useUser } from "@auth0/nextjs-auth0";
import InfiniteScroll from "react-infinite-scroll-component";
import {
    PaperAirplaneIcon as PaperAirplaneIconOutline,
    AnnotationIcon as AnnotationIconOutline,
} from "@heroicons/react/outline";
import {
    PaperAirplaneIcon as PaperAirplaneIconSolid,
    AnnotationIcon as AnnotationIconSolid,
} from "@heroicons/react/solid";

import Comment from "../items/Comment";
import BaseModal from "./Base";

export default function CommentsModal({ id, commentCount, viewerCommented }) {
    const { user, error: auth0Error } = useUser();
    const htmlId = "commentInput";

    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null;
        if (pageIndex === 0) return `/api/publications/${id}/comments`;
        return `/api/publications/${id}/comments?afterId=${previousPageData.afterId}`;
    };
    const { data, size, setSize, mutate } = useSWRInfinite(getKey);

    const comments =
        data && data[0].data
            ? [].concat(...data?.map((page) => [].concat(...page?.data)))
            : [];

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
            setCreateCommentError(
                "El comentario debe tener al menos 5 caracteres"
            );
        } else if (message.length > 280) {
            setCreateCommentError(
                "El comentario no debe tener más de 280 caracteres"
            );
        } else {
            document.getElementById(htmlId).innerText = "";
            createComment(message);
        }

        setIsCreatingComment(false);
    };

    const createComment = (body) =>
        fetch(`/api/publications/${id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                body,
            }),
        }).then(() => mutate());

    return (
        <>
            <div className="flex">
                <button type="button" onClick={handleOpen}>
                    {viewerCommented ? (
                        <AnnotationIconSolid className="w-5" />
                    ) : (
                        <AnnotationIconOutline
                            strokeWidth={1.5}
                            className="w-5"
                        />
                    )}
                </button>
                <span>{commentCount || 0}</span>
            </div>

            <BaseModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Comentarios"
            >
                <div className="flex w-full items-start mb-4">
                    <div className="flex-none w-max mr-4">
                        <div className="relative h-10 w-10">
                            <Image
                                src={user?.picture || "/ru1.png"}
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
                    <div className="text-red-500 text-sm">
                        {createCommentError}
                    </div>
                )}
                <InfiniteScroll
                    dataLength={comments.length}
                    next={() => setSize(size + 1)}
                    hasMore={data && Boolean(data[data.length - 1].afterId)}
                    loader={<h1>Loading...</h1>}
                    endMessage={
                        <p className="text-center">
                            <b>Yay! You have seen it all :D</b>
                        </p>
                    }
                >
                    {comments?.map(
                        (item) => item && <Comment key={item.id} {...item} />
                    )}
                </InfiniteScroll>
            </BaseModal>
        </>
    );
}
