import FollowersModal from "../modals/Followers";

export const AuthorStatsButtons = ({ stats, username, updateUser }) => {
    const follow = async () => {
        const response = await fetch(`/api/users/${username}/follow`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json());

        updateUser(response.stats);
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
            <div className="flex justify-center my-2">
                <div className="flex">
                    {
                        stats.following ? (
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
        </div>
    );
}

