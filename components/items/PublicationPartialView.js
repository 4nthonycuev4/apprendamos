/** @format */
import { useState, useRef, useEffect } from "react";
import { InView } from 'react-intersection-observer';

import BasicAuthorCard from './AuthorCard/Basic';
import PublicationOptionsButton from "../buttons/PublicationOptions";
import PublicationStats from '../PublicationStats';
import { MDParsed } from "../Markdown";


export const PublicationPartialView = ({ body, publishedAt, author, id, stats }) => {
  const [start, setStart] = useState(false);
  const timer = useRef(0);
  const firstStart = useRef(true);
  const tick = useRef(null);
  const handled = useRef(false);

  useEffect(() => {
    if (firstStart.current) {
      firstStart.current = !firstStart.current;
    } else {
      if (start) {
        tick.current = setInterval(() => { // <-- set tick ref current value
          timer.current = timer.current + 1;
        }, 1000);
      } else {
        clearInterval(tick.current); // <-- access tick ref current value
        if (timer.current >= 10) {
          timer.current = timer.current - 1;
        }
      }
    }
  }, [start]);

  const handleView = () => {
    fetch(`/api/publications/${id}/view`)
  }

  return (
    <div className="py-2 border-b">
      <div className="flex justify-between items-center">
        <BasicAuthorCard {...author} />
        <div className="flex items-center">
          <PublicationOptionsButton publicationId={id} publishedAt={publishedAt} />
        </div>
      </div>
      <InView as="div" className="px-12 pb-2" threshold={0.25} onChange={(inView, entry) => {
        if (timer.current >= 10 && !handled.current) {
          handled.current = true;
          handleView();
        } else if (inView && entry.isIntersecting) {
          setStart(true);
        } else {
          setStart(false);
        }
      }}>
        <MDParsed body={body} />
      </InView>
      <PublicationStats {...stats} publicationId={id} />
    </div>)
}

export default PublicationPartialView;