/** @format */

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import {
  AnnotationIcon as AnnotationIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  HeartIcon as HeartIconOutline,
} from "@heroicons/react/outline";
import {
  AnnotationIcon as AnnotationIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/solid";
import Link from "next/link";

import CommentForm from "./forms/CommentForm";
import Comments from "./lists/Comments";

export default function Interactions({
  authorUsername,
  contentRef,
  startViewerStats = { like: false, comments: 0, saved: false },
  startStats,
  startComments = [],
  commentInput,
  minimal,
}) {
  const [viewerStats, setViewerStats] = useState(startViewerStats);
  const [comments, setComments] = useState(startComments);
  const [stats, setStats] = useState(startStats);

  const { user } = useUser();

  useEffect(() => {
    const getViewerStats = async () => {
      const res = await fetch("/api/interactions/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: contentRef,
        }),
      })
        .then((resx) => resx.json())
        .catch((err) => console.log(err));
      setViewerStats(res);
    };

    if (!viewerStats?.ref && user?.ref) {
      getViewerStats();
    }
  });

  async function likeContent() {
    try {
      const resx = await fetch("/api/interactions/content/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: contentRef,
        }),
      }).then((res) => res.json());

      setStats(resx.stats);
      setViewerStats(resx.viewerStats);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center space-x-8 ">
        <div className="flex text-blue-400">
          <span>{stats.comments}</span>
          <button type="button" disabled>
            {viewerStats && viewerStats.comments > 0 ? (
              <AnnotationIconSolid className="w-5" />
            ) : (
              <AnnotationIconOutline strokeWidth={1.5} className="w-5" />
            )}
          </button>
        </div>
        <div className="flex text-red-400">
          <span>{stats.likes}</span>
          <button
            type="button"
            disabled={!user?.ref}
            onClick={() => likeContent()}
          >
            {viewerStats && viewerStats.like ? (
              <HeartIconSolid className="w-5" />
            ) : (
              <HeartIconOutline strokeWidth={1.5} className="w-5" />
            )}
          </button>
        </div>
        <div className="flex text-gray-700">
          <span>{stats.saved}</span>
          <button disabled>
            {viewerStats && viewerStats.saved > 0 ? (
              <BookmarkIconSolid className="w-5" />
            ) : (
              <BookmarkIconOutline strokeWidth={1.5} className="w-5" />
            )}
          </button>
        </div>
      </div>
      {commentInput ? (
        <CommentForm
          contentRef={contentRef}
          comments={comments}
          setViewerStats={setViewerStats}
          setStats={setStats}
          setComments={setComments}
        />
      ) : (
        <Link
          href={`/@/${authorUsername}/${contentRef.collection.toLowerCase()}/${
            contentRef.id
          }`}
        >
          <a>
            <h1>Ver comentarios</h1>
          </a>
        </Link>
      )}
      <Comments comments={comments} minimal={minimal} viewer={user} />
    </div>
  );
}
