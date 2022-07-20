import useSWR from "swr";
import { useUser } from "@auth0/nextjs-auth0";
import {
    BookmarkIcon as BookmarkIconOutline,
    HeartIcon as HeartIconOutline,
    ThumbDownIcon as ThumbDownIconOutline,
    ThumbUpIcon as ThumbUpIconOutline,
} from "@heroicons/react/outline";
import {
    BookmarkIcon as BookmarkIconSolid,
    HeartIcon as HeartIconSolid,
    ThumbDownIcon as ThumbDownIconSolid,
    ThumbUpIcon as ThumbUpIconSolid,
} from "@heroicons/react/solid";
import CommentsModal from "./modals/Comments";

export const PublicationInteractions = ({ id }) => {
    const { user, error } = useUser();
    const isAuthenticated = !error && user?.id;

    const { data: stats, mutate: refetchStats } = useSWR(
        `/api/publications/${id}/stats`,
        { revalidateOnFocus: true, refreshInterval: 5000 }
    );
    const { data: interactions, mutate: refetchInteractions } = useSWR(
        isAuthenticated && `/api/publications/${id}/interactions`,
        { revalidateOnFocus: true, refreshInterval: 5000 }
    );

    const like = () =>
        fetch(`/api/publications/${id}/interactions/like`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            refetchStats();
            refetchInteractions();
        });

    const dislike = () =>
        fetch(`/api/publications/${id}/interactions/dislike`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            refetchStats();
            refetchInteractions();
        });

    const save = () =>
        fetch(`/api/publications/${id}/interactions/save`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            refetchStats();
            refetchInteractions();
        });

    return (
        <div className="flex justify-center space-x-8 ">
            <div className="flex ">
                <button
                    type="button"
                    disabled={!isAuthenticated}
                    onClick={like}
                >
                    {isAuthenticated && interactions && interactions.like ? (
                        <ThumbUpIconSolid className="w-5" />
                    ) : (
                        <ThumbUpIconOutline strokeWidth={1.5} className="w-5" />
                    )}
                </button>
                <span>{(stats && stats.likeCount) || 0}</span>
            </div>

            <div className="flex text-red-400">
                <button type="button" disabled={!isAuthenticated}>
                    {isAuthenticated && interactions && interactions.cheer ? (
                        <HeartIconSolid className="w-5" />
                    ) : (
                        <HeartIconOutline strokeWidth={1.5} className="w-5" />
                    )}
                </button>
                <span>{(stats && stats.cheerCount) || 0}</span>
            </div>

            <div className="flex ">
                <button
                    type="button"
                    disabled={!isAuthenticated}
                    onClick={dislike}
                >
                    {isAuthenticated && interactions && interactions.dislike ? (
                        <ThumbDownIconSolid className="w-5" />
                    ) : (
                        <ThumbDownIconOutline
                            strokeWidth={1.5}
                            className="w-5"
                        />
                    )}
                </button>
            </div>
            <div className="flex">
                <button
                    type="button"
                    disabled={!isAuthenticated}
                    onClick={save}
                >
                    {isAuthenticated && interactions && interactions.save ? (
                        <BookmarkIconSolid className="w-5" />
                    ) : (
                        <BookmarkIconOutline
                            strokeWidth={1.5}
                            className="w-5"
                        />
                    )}
                </button>
            </div>
        </div>
    );
};
