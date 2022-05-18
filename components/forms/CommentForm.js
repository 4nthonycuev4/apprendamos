/** @format */
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useRouter } from "next/router";

export default function CommentForm({
  contentRef,
  comments,
  setViewerStats,
  setStats,
  setComments,
  commentToUpdate,
}) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  useEffect(() => {
    const setCommentToUpdate = (comment) => {
      document.getElementById(comment.ref.id).innerText = comment.message;
    };

    if (commentToUpdate) {
      setCommentToUpdate(commentToUpdate);
    }
  }, [commentToUpdate]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    const htmlId = commentToUpdate
      ? commentToUpdate.ref.id
      : `commentInput${contentRef.id}`;

    const rawComment = document.getElementById(htmlId).innerText;
    if (rawComment.length < 10) {
      setError("El comentario debe tener al menos 10 caracteres");
    } else if (rawComment.length >= 280) {
      setError("El comentario debe tener menos de 280 caracteres");
    } else {
      let coins = 0;
      let message = "";

      const regex = /(?<=\[)(.*?)(?=\])/;
      const matches = rawComment.match(regex);

      if (matches) {
        message = rawComment.replace(`[${matches[0]}]`, "").trim();
        coins = matches[0].replace(" ", "");
        coins = parseInt(coins);
        if (!coins) {
          coins = 0;
          message = rawComment;
        }
      } else {
        message = rawComment;
      }
      document.getElementById(htmlId).innerText = "";

      commentToUpdate ? updateComment(message) : createComment(message, coins);
    }
    setIsSubmitting(false);
  };

  const createComment = async (message, coins) => {
    const res = await fetch("/api/comments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: contentRef,
        message,
        coins,
      }),
    }).then((res) => res.json());

    setViewerStats(res.viewerStats);
    setStats(res.stats);
    setComments(
      [{ ...res.comment, author: res.author }].concat(comments)
    );
  };

  const updateComment = async (message) => {
    await fetch("/api/comments/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentRef: commentToUpdate.ref,
        message,
      }),
    });
    router.reload();
  };

  if (isLoading || !user) {
    return <div>Inicia sesión para comentar...</div>;
  }

  if (commentToUpdate) {
    return (
      <div className="flex items-start space-x-4">
        <div>
          <div className="relative h-10 w-10">
            <Image
              src={user.picture}
              alt="Picture of the author"
              layout="fill"
              objectFit="fill"
              className="rounded-full"
            />
          </div>
        </div>
        <div className="flex w-full items-start space-x-4">
          <div className="w-full">
            <div
              id={commentToUpdate.ref.id}
              type="text"
              className="min-w-4 w-full border-0 border-b-2 border-gray-200 p-2 empty:before:text-gray-400 empty:before:content-['Agrega_un_comentario...'] focus:ring-0"
              contentEditable={Boolean(user)}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!user}
            className=" text-blue-500 disabled:text-gray-400"
          >
            <PaperAirplaneIcon className="w-5" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full items-start space-x-4">
      <div className="w-2/12">
        <div className="relative h-10 w-10">
          <Image
            src={user.picture}
            alt="Picture of the author"
            layout="fill"
            objectFit="fill"
            className="rounded-full"
          />
        </div>
      </div>
      <div className="flex w-10/12 items-start ">
        <div className="w-10/12 flex-wrap">
          <p
            id={`commentInput${contentRef.id}`}
            type="text"
            className="
							break-word border-0 border-b-2 border-gray-200  bg-gray-100 p-2 
							
							text-gray-800
              dark:text-white
							empty:before:text-gray-400
							
							empty:before:content-['Agrega_un_comentario...']
							focus:border-gray-400

							focus:ring-0 
							dark:border-gray-600
							dark:bg-gray-800 

							dark:empty:before:text-gray-500
							dark:focus:border-gray-400
							
							"
            contentEditable={Boolean(user)}
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="w-1/12" />

        <div className="flex w-1/12 justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !user || error}
            className=" mt-2 text-blue-500 disabled:text-gray-400"
          >
            <PaperAirplaneIcon className="w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
