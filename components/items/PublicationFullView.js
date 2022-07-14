/** @format */
import moment from "moment";

import AuthorCard from './AuthorCard';
import Tags from "../Tags";
import CardView from "./CardView";

export default function PublicationFullView({
  author,
  title,
  body,
  tags,
  flashcards,
  created,
  updated,
}) {

  return (
    <article className="space-y-2 py-2 px-6">
      <AuthorCard {...author} />
      <h1 className="text-3xl font-black">{title}</h1>
      <div
        className="prose prose-img:mx-auto prose-img:rounded-lg dark:prose-invert text-ellipsis overflow-hidden"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <div className="text-right text-sm dark:text-gray-300">
        <p>Creado el {moment(created).format("LL")}</p>
        {updated && <p>Editado por última vez el {moment(updated).format("LL")}</p>}
      </div>
      <Tags tags={tags} />
      {flashcards && <CardView cards={flashcards} />}
    </article>
  );
}
