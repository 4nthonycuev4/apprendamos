/** @format */

import moment from "moment";
import Link from "next/link";

import BasicAuthorCard from './BasicAuthorCard';
import FullAuthorCard from './FullAuthorCard';
import Interactions from "../Interactions";
import Tags from "../Tags";

import CardView from "./CardView";

export default function Flashquiz({
  flashquiz,
  author,
  minimal,
}) {
  if (minimal) {
    return (
      <article className="space-y-2 py-2 px-6 overflow-hidden">
        <div className="flex justify-between items-center">
          <BasicAuthorCard author={author} />
          <button type="button" className="h-6 w-24 rounded text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700">
            Flashquiz
          </button>
        </div>
        <Link href={`/@/${author.username}/flashquizzes/${flashquiz.ref.id}`}>
          <a>
            <h1 className="text-2xl font-bold">{flashquiz.title}</h1>
          </a>
        </Link>
        <div
          className="prose prose-sm line-clamp-2 prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: flashquiz.body.slice(0, 250) + "..." }}
        />
        <Link href={`/@/${author.username}/flashquizzes/${flashquiz.ref.id}`}>
          <a>
            <p className="text-right text-sm dark:text-gray-300">
              Hace {moment(flashquiz.created).fromNow()}
            </p>
          </a>
        </Link>
      </article>
    );
  } return (<article className="space-y-2 py-2 px-6">
    <FullAuthorCard author={author} />
    <h1 className="text-3xl font-black">{flashquiz.title}</h1>
    <div
      className="prose prose-sm line-clamp-2 prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: flashquiz.body }}
    />
    <CardView cards={flashquiz.flashcards} canEdit={false} />

    <div className="text-right text-sm dark:text-gray-300">
      <p>Creado el {moment(flashquiz.created).format("LL")}</p>
      <p>Editado por última vez el {moment(flashquiz.ts / 1000).format("LL")}</p>
    </div>
    <Tags tags={flashquiz.tags} />
    <Interactions
      contentRef={flashquiz.ref}
      authorUsername={author.username}
      startStats={flashquiz.stats}
    />
  </article>)

}
