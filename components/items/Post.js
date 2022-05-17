/** @format */
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

import FollowButton from "../buttons/Follow";
import Interactions from "../Interactions";
import Tags from "../Tags";

export default function Post({
  post,
  author,
  comments,
  startViewerStats,
  minimal,
  commentInput = true,
}) {
  if (minimal) {
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
                <h1 className="font-semibold">{author.name}</h1>
                <h1 className="font-normal dark:text-gray-300">{`@${author.username}`}</h1>
              </a>
            </Link>
          </div>
        </div>
        <Link href={`/@/${author.username}/posts/${post.ref.id}`}>
          <a>
            <h1 className="text-3xl font-black">{post.title}</h1>
          </a>
        </Link>
        <div
          className="prose line-clamp-2 prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: post.bodyHTML }}
        />
        <Link href={`/@/${author.username}/posts/${post.ref.id}`}>
          <a>
            <p className="text-right text-sm dark:text-gray-300">
              Hace {moment(post.created).fromNow()}
            </p>
          </a>
        </Link>
      </article>
    );
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
              <span className="font-semibold">{author.name}</span>
              <span className="font-normal dark:text-gray-300">{` @${author.username}`}</span>
            </a>
          </Link>
          <FollowButton username={author.username} />
        </div>
      </div>
      <h1 className="text-3xl font-black">{post.title}</h1>
      <div
        className="prose prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: post.bodyHTML }}
      />
      <div className="text-right text-sm dark:text-gray-300">
        <p>Creado el {moment(post.created).format("LL")}</p>
        <p>Editado por última vez el {moment(post.ts / 1000).format("LL")}</p>
      </div>
      <Tags tags={post.tags} />
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
