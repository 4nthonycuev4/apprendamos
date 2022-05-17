/** @format */

import { DotsHorizontalIcon } from "@heroicons/react/outline";
import moment from "moment";
import Link from "next/link";

import Interactions from "../Interactions";
import Tags from "../Tags";

import AuthorCard from "./AuthorCard";
import CardView from "./CardView";

export default function Flashquiz({
  flashquiz,
  author,
  comments,
  startViewerStats,
  commentInput = true,
  minimal,
}) {
  return (
    <div className="p-4">
      <Link href={`/@/${author.username}/flashquizzes/${flashquiz.ref.id}`}>
        <a className="text-xl font-bold hover:underline">{flashquiz.name}</a>
      </Link>
      <CardView cards={flashquiz.flashcards} canEdit={false} />
      <Tags tags={flashquiz.tags} />
      <div className="flex items-center justify-between">
        <AuthorCard author={author} />

        <div className="flex space-x-1">
          <p className="text-right">{moment(flashquiz.created).fromNow()}</p>
          <button type="button">
            <Link
              href={`/@/${author.username}/flashquizzes/${flashquiz.ref.id}/options`}
            >
              <a>
                <DotsHorizontalIcon className="w-5 text-gray-700" />
              </a>
            </Link>
          </button>
        </div>
      </div>
      <Interactions
        authorUsername={author.username}
        startViewerStats={startViewerStats}
        contentRef={flashquiz.ref}
        startStats={flashquiz.stats}
        startComments={comments}
        commentInput={commentInput}
        minimal={minimal}
      />
    </div>
  );
}
