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
  contentRef,
  startStats,
}) {
  const [viewerStats, setViewerStats] = useState({ like: false, comments: 0, saved: false });
  const [comments, setComments] = useState(null);
  const [stats, setStats] = useState(startStats);

  const { user } = useUser();

  useEffect(() => {
    const getViewerStats = async () => {
      const viewerStats = await fetch(`/api/${contentRef.collection}/${contentRef.id}/viewerStats`)
        .then((res) => res.json())
        .catch((err) => console.log(err));
      setViewerStats(viewerStats);
    };

    const getComments = async () => {
      const comments = await fetch(`/api/${contentRef.collection}/${contentRef.id}/comments`)
        .then((res) => res.json())
        .catch((err) => console.log(err));
      setComments(comments);
    };
    getViewerStats();
    getComments();
  }, []);

  async function likeContent() {
    try {
      const resx = await fetch("/api/interactions/content/like", {
        method: "PUT",
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
      <CommentForm
        contentRef={contentRef}
        comments={comments}
        setViewerStats={setViewerStats}
        setStats={setStats}
        setComments={setComments}
      />
      <Comments comments={comments} viewer={user} />
    </div>
  );
}
