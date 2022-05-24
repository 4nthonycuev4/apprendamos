/** @format */

import moment from "moment";
import Link from "next/link";

import BasicAuthorCard from './BasicAuthorCard';
import FullAuthorCard from './FullAuthorCard';
import Interactions from "../Interactions";
import Tags from "../Tags";

import CardView from "./CardView";

export default function memorama({
  faunaRef,
  title,
  created,
  updated,
  stats,
  body,
  tags,
  flashcards,
  author,
  minimal,
}) {
  if (minimal) {
    return (
      <article className="space-y-2 py-2 px-6 overflow-hidden">
        <div className="flex justify-between items-center">
          <BasicAuthorCard author={author} />
          <button type="button" className="h-6 w-24 rounded text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700">
            Memorama
          </button>
        </div>
        <Link href={`/m/${faunaRef.id}`}>
          <a>
            <h1 className="text-2xl font-bold">{title}</h1>
          </a>
        </Link>
        <div
          className="prose prose-sm line-clamp-2 prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: body.slice(0, 250) + "..." }}
        />
        <Link href={`/m/${faunaRef.id}`}>
          <a>
            <p className="text-right text-sm dark:text-gray-300">
              Hace {moment(created).fromNow()}
            </p>
          </a>
        </Link>
      </article>
    );
  } return (<article className="space-y-2 py-2 px-6">
    <FullAuthorCard author={author} />
    <h1 className="text-3xl font-black">{title}</h1>
    <div
      className="prose prose-sm line-clamp-2 prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: body }}
    />
    <CardView cards={flashcards} canEdit={false} />

    <div className="text-right text-sm dark:text-gray-300">
      <p>Creado el {moment(created).format("LL")}</p>
      <p>Editado por última vez el {moment(updated).format("LL")}</p>
    </div>
    <Tags tags={tags} />
    <Interactions
      contentRef={faunaRef}
      authorUsername={author.username}
      startStats={stats}
    />
  </article>)

}
