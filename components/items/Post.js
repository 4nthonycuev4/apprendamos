/** @format */
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

import FollowButton from "../buttons/Follow";
import Interactions from "../Interactions";
import Tags from "../Tags";

import AuthorCard from "./AuthorCard";

export default function Post({
  post,
  author,
  comments,
  startViewerStats,
  minimal,
  commentInput = true,
}) {
  if (minimal) {
    return <></>;
  }
  return (
    <article className="space-y-2 py-2 px-6">
      <div className="flex items-center space-x-2">
        <Link href={`/@/${author.username}`}>
          <a>
            <div className="relative h-12 w-12">
              <Image
                src={author.picture}
                alt="Picture of the author"
                layout="fill"
                objectFit="fill"
                className="rounded-full"
              />
            </div>
          </a>
        </Link>
        <div>
          <Link href={`/@/${author.username}`}>
            <a>
              <h1 className="font-semibold">
                {author.name}
                <span className="font-normal dark:text-gray-300">{` @${author.username}`}</span>
              </h1>
              <h2>haola </h2>
            </a>
          </Link>

          <div className="flex items-center justify-between text-xs font-normal">
            <FollowButton />
            <span className="text-sm dark:text-gray-300">
              {moment(post.created).format("LL")}
            </span>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-black">{post.title}</h1>
      <div
        className="prose prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.bodyHTML }}
      />
      <Tags tags={post.tags} />
      <div className="flex items-center justify-between">
        <AuthorCard author={author} />

        <div className="flex space-x-1">
          <button type="button">
            <Link href={`/@/${author.username}/posts/${post.ref.id}/options`}>
              <a>
                <DotsHorizontalIcon className="w-5 text-gray-700" />
              </a>
            </Link>
          </button>
        </div>
      </div>
      <Interactions
        contentRef={post.ref}
        authorUsername={author.username}
        startViewerStats={startViewerStats}
        startStats={post.stats}
        startComments={comments}
        commentInput={commentInput}
        minimal={minimal}
      />
    </article>
  );
}
