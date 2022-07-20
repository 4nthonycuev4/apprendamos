/** @format */

import { useRef } from "react";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";

import CommentForm from "./forms/CommentForm";
import Comment from "./items/Comment";

export default function CommentOptionsModal({
    onClose = () => {},
    comment,
    viewer,
}) {
    const overlayRef = useRef();
    const router = useRouter();

    const deleteComment = async () => {
        await fetch("/api/comments/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commentId: comment.comment.id,
            }),
        })
            .then((resx) => resx.json())
            .catch((err) => console.log(err));
        router.reload();
    };

    return (
        <Dialog
            static
            open
            onClose={onClose}
            initialFocus={overlayRef}
            className="fixed inset-0 z-10 flex items-center justify-center w-full"
        >
            <div className="fixed inset-0 dark:bg-slate-700 max-w-xl mx-auto" />
            <div className="solid py-auto relative h-full w-auto mx-6 items-center justify-center space-y-4">
                <div className="mx-auto mt-10 w-full space-y-8 px-4 sm:w-1/2">
                    {viewer?.username === comment.author.username ? (
                        <CommentForm commentToUpdate={comment.comment} />
                    ) : (
                        <Comment
                            comment={comment.comment}
                            author={comment.author}
                            minimal
                        />
                    )}
                    <div className="flex justify-center space-x-4">
                        <button
                            type="button"
                            className="w-40 rounded-lg border py-2 hover:bg-slate-100"
                            onClick={onClose}
                        >
                            Atrás
                        </button>
                        {viewer?.username === comment.author.username && (
                            <button
                                type="button"
                                className="w-40 rounded-lg border py-2 hover:bg-slate-100"
                                onClick={deleteComment}
                            >
                                Eliminar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
