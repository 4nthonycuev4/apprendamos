import {
    BookmarkIcon as BookmarkIconOutline,
    HeartIcon as HeartIconOutline,
    ThumbDownIcon as ThumbDownIconOutline,
    ThumbUpIcon as ThumbUpIconOutline,
} from "@heroicons/react/outline"; import { useUser } from '@auth0/nextjs-auth0';
import {
    BookmarkIcon as BookmarkIconSolid,
    HeartIcon as HeartIconSolid,
    ThumbDownIcon as ThumbDownIconSolid,
    ThumbUpIcon as ThumbUpIconSolid,
} from "@heroicons/react/solid";
import CommentsModal from "../modals/Comments";

export const ContentStatsButtons = ({ stats, setStats, viewerStats, setViewerStats, contentId }) => {
    const { user, error } = useUser();

    const isAuthenticated = !error && user?.id;

    const like = async () => {
        const response = await fetch(`/api/${contentId}/like`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json());

        setStats(response.stats);
        setViewerStats(response.viewerStats);
    }

    const dislike = async () => {
        const response = await fetch(`/api/${contentId}/dislike`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json());

        setStats(response.stats);
        setViewerStats(response.viewerStats);
    }

    const save = async () => {
        const response = await fetch(`/api/${contentId}/save`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json());

        setStats(response.stats);
        setViewerStats(response.viewerStats);
    }

    return (
        <div className="flex justify-center space-x-8 ">
            <CommentsModal contentId={contentId} viewerComment={viewerStats.comment} commentCount={stats.commentCount} />
            <div className="flex ">
                <button type="button" disabled={!isAuthenticated} onClick={like}>
                    {viewerStats?.like ? (
                        <ThumbUpIconSolid className="w-5" />
                    ) : (
                        <ThumbUpIconOutline strokeWidth={1.5} className="w-5" />
                    )}
                </button>
                <span>{stats.likeCount}</span>
            </div>

            <div className="flex text-red-400">
                <button
                    type="button"
                    disabled={!isAuthenticated}
                >
                    {viewerStats?.cheer ? (
                        <HeartIconSolid className="w-5" />
                    ) : (
                        <HeartIconOutline strokeWidth={1.5} className="w-5" />
                    )}
                </button>
                <span>{stats.cheerCount}</span>
            </div>
            <div className="flex ">
                <button type="button" disabled={!isAuthenticated} onClick={dislike}>
                    {viewerStats?.dislike ? (
                        <ThumbDownIconSolid className="w-5" />
                    ) : (
                        <ThumbDownIconOutline strokeWidth={1.5} className="w-5" />
                    )}
                </button>
            </div>
            <div className="flex">
                <button type="button" disabled={!isAuthenticated} onClick={save}>
                    {viewerStats?.save ? (
                        <BookmarkIconSolid className="w-5" />
                    ) : (
                        <BookmarkIconOutline strokeWidth={1.5} className="w-5" />
                    )}
                </button>
                <span>{stats.saveCount}</span>
            </div>
        </div>
    )
}

