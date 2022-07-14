import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import FollowersModal from "../modals/Followers";


const FollowButton = ({ following, follow }) => (
    <div className="flex justify-center my-2">
        <div className="flex">
            {
                following ? (
                    <button type="button" onClick={follow} className="h-6 w-32 rounded bg-black font-semibold text-white"
                    >
                        Siguiendo
                    </button>
                ) : (
                    <button type="button" onClick={follow} className="h-6 w-32 rounded bg-red-600  font-semibold text-white"
                    >
                        Seguir
                    </button>
                )
            }
        </div>
    </div>
)

export const AuthorStatsButtons = ({ originalStats, username }) => {
    const { user, loading } = useUser();
    const [stats, setStats] = useState(originalStats)

    useEffect(() => {
        setStats(originalStats)
    }, [originalStats])

    const getFollowing = async () => {
        const following = await fetch(`/api/users/following/${username}`)
        const followingJson = await following.json()
        setStats({ ...stats, following: followingJson })
    }

    const follow = async () => {
        const response = await fetch(`/api/users/${username}/follow`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json());

        setStats(response.stats);
    }

    return (
        <div>
            <div className="flex justify-center space-x-8 items-center">
                <div className="flex space-x-1">
                    <span className="font-black">{stats.likeCount}</span>
                    <span>Likes</span>
                </div>
                <FollowersModal username={username} followerCount={stats.followerCount} />
                <div className="flex space-x-1">
                    <span className="font-black">{stats.followingCount}</span>
                    <span>Siguiendo</span>
                </div>
            </div>
            {user?.username && <FollowButton following={stats.following} follow={follow} />}
        </div>
    );
}

