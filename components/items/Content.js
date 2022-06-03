/** @format */
import { useState } from "react";
import moment from "moment";
import Link from "next/link";
import BasicAuthorCard from './BasicAuthorCard';
import ContentOptionsButton from "../buttons/ContentOptions";
import CardView from './CardView';
import { ContentStatsButtons } from './../buttons/ContentStats';



export const Content = ({ title, body, flashcards, created, author, id, stats, viewerStats }) => {
  const [contentStats, setContentStats] = useState(stats);
  const [viewerContentStats, setViewerContentStats] = useState(viewerStats);

  return (
    <div className="py-4 px-4 border-b">
      <div className="flex justify-between items-center">
        <BasicAuthorCard {...author} />
        <ContentOptionsButton contentId={id} />
      </div>
      <Link href={"/" + id}>
        <a>
          <h1 className="text-2xl font-bold">{title}</h1>
        </a>
      </Link>
      <div
        className='prose prose-img:mx-auto prose-img:rounded-lg dark:prose-invert'
        dangerouslySetInnerHTML={{ __html: body.slice(0, 250) }}
      />
      {
        flashcards &&
        <CardView cards={flashcards} />
      }
      <ContentStatsButtons stats={contentStats} setStats={setContentStats} viewerStats={viewerContentStats} setViewerStats={setViewerContentStats} contentId={id} />
      <div className="flex justify-end">
        <Link href={id}>
          <a>
            <p className="text-sm dark:text-gray-300">
              Hace {moment(created).fromNow()}
            </p>
          </a>
        </Link></div>
    </div>)
}