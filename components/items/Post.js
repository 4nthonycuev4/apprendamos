/** @format */
import moment from "moment";
import Link from "next/link";

import BasicAuthorCard from './BasicAuthorCard';
import FullAuthorCard from './FullAuthorCard';
import Interactions from "../Interactions";
import Tags from "../Tags";

export default function Post({
  post,
  author,
  minimal,
}) {
  if (minimal) {
    return (
      <article className="space-y-2 py-2 px-6">
        <BasicAuthorCard author={author} />
        <Link href={`/@/${author.username}/posts/${post.ref.id}`}>
          <a>
            <h1 className="text-2xl font-bold">{post.title}</h1>
          </a>
        </Link>
        <div
          className="prose prose-sm line-clamp-2 prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: post.body }}
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
      <FullAuthorCard author={author} />
      <h1 className="text-3xl font-black">{post.title}</h1>
      <div
        className="prose prose-img:mx-auto prose-img:rounded-lg dark:prose-invert text-ellipsis overflow-hidden"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
      <div className="text-right text-sm dark:text-gray-300">
        <p>Creado el {moment(post.created).format("LL")}</p>
        <p>Editado por última vez el {moment(post.ts / 1000).format("LL")}</p>
      </div>
      <Tags tags={post.tags} />
      <Interactions
        contentRef={post.ref}
        startStats={post.stats}
      />
    </article>
  );
}
