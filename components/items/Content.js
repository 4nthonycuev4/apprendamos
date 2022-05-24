/** @format */

import BasicAuthorCard from './BasicAuthorCard';
import moment from "moment";
import Link from "next/link";
import ContentOptionsButton from "../buttons/ContentOptions";


const types = {
  questions: "Pregunta",
  articles: "Artículo",
  memoramas: "Memorama",
}


export const Content = ({ title, body, created, author, faunaRef }) => {
  const type = types[faunaRef.collection];
  const link = `/${faunaRef.collection}/${faunaRef.id}`;
  return (
    <div className="py-2 px-6 border-b">
      <div className="flex justify-between items-center">
        <BasicAuthorCard author={author} />
        <ContentOptionsButton type={type} link={link} faunaRef={faunaRef} />
      </div>
      <Link href={link}>
        <a>
          <h1 className="text-2xl font-bold">{title}</h1>
        </a>
      </Link>
      <div
        className="prose prose-sm line-clamp-2 prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: body.slice(0, 250) }}
      />
      <Link href={link}>
        <a>
          <p className="text-right text-sm dark:text-gray-300">
            Hace {moment(created).fromNow()}
          </p>
        </a>
      </Link>
    </div>)
}