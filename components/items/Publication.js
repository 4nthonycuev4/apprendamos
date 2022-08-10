/** @format */
import { useState, useRef, useEffect } from "react";
import { InView } from "react-intersection-observer";
import moment from "moment";

import BasicAuthorCard from "./AuthorCard/Basic";
import PublicationOptionsButton from "../buttons/PublicationOptions";
import PublicationStats from "../PublicationStats";
import { MDParsed } from "../Markdown";

export const ItemPublication = ({
    body,
    created_at,
    author,
    fref,
    stats,
    saved_at,
}) => {
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
                tick.current = setInterval(() => {
                    // <-- set tick ref current value
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
        fetch(`/api/publications/${fref.id}/view`);
    };

    return (
        <div className="p-2 border-b hover:bg-gray-50 min-h-[100%]">
            <div className="flex justify-between items-center">
                <BasicAuthorCard {...author} />
                <div className="flex items-center">
                    <PublicationOptionsButton
                        publication_id={fref.id}
                        created_at={created_at}
                    />
                </div>
            </div>
            <InView
                as="div"
                threshold={0.25}
                onChange={(inView, entry) => {
                    if (timer.current >= 10 && !handled.current) {
                        handled.current = true;
                        handleView();
                    } else if (inView && entry.isIntersecting) {
                        setStart(true);
                    } else {
                        setStart(false);
                    }
                }}
            >
                <MDParsed
                    body={
                        body +
                        "..." +
                        (saved_at
                            ? "\n\n`Guardado " +
                              moment(saved_at).fromNow() +
                              "`"
                            : "")
                    }
                />
            </InView>
            <PublicationStats {...stats} publication_id={fref.id} />
        </div>
    );
};

export default ItemPublication;
