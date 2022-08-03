import Link from "next/link";
import useSWR from "swr";
import { useUser } from "@auth0/nextjs-auth0";

import FollowersModal from "./modals/Followers";
import FollowingModal from "./modals/Following";

const AuthorInteractions = ({ nickname }) => {
    const { user, error } = useUser();
    const isAuthenticated = !error && user?.id;
    const isAuthor = user?.nickname === nickname;

    const { data: stats, mutate: refetchStats } = useSWR(
        `/api/authors/${nickname}/stats`,
        { refreshInterval: 5000 }
    );
    const { data: interactions, mutate: refetchInteractions } = useSWR(
        isAuthenticated && `/api/authors/${nickname}/interactions`,
        { refreshInterval: 5000 }
    );

    const isFollowing = (interactions && interactions.follow) || false;

    const follow = () =>
        fetch(`/api/authors/${nickname}/interactions/follow`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            refetchStats();
            refetchInteractions();
        });

    return (
        <div>
            <div className="flex justify-center space-x-8 items-center">
                <div className="flex space-x-1">
                    <span className="font-black">
                        {(stats && stats.likeCount) || 0}
                    </span>
                    <span>Likes</span>
                </div>
                <FollowersModal
                    nickname={nickname}
                    followerCount={(stats && stats.followerCount) || 0}
                />
                <FollowingModal
                    nickname={nickname}
                    followingCount={(stats && stats.followingCount) || 0}
                />
            </div>
            {isAuthenticated &&
                (isAuthor ? (
                    <Link href="/settings/profile">
                        <a>
                            <button className="font-bold text-white py-1 w-36 rounded-full border-[1.5px] bg-gray-900 hover:bg-gray-800">
                                Configurar
                            </button>
                        </a>
                    </Link>
                ) : isFollowing ? (
                    <button
                        className='font-bold py-1 w-36 rounded-full border-[1.5px] border-gray-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500 hover:before:content-["Dejar_de_seguir"] before:content-["Siguiendo"]'
                        onClick={follow}
                    />
                ) : (
                    <button
                        className="font-bold text-white py-1 w-36 rounded-full border-[1.5px] bg-gray-900 hover:bg-gray-800"
                        onClick={follow}
                    >
                        Seguir
                    </button>
                ))}
        </div>
    );
};

export default AuthorInteractions;
