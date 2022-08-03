import Link from "next/link";
import useSWR from "swr";
import { useUser } from "@auth0/nextjs-auth0";

export default function FollowButton({ nickname }) {
    const { user, error } = useUser();
    const isAuthenticated = !error && user?.sub;
    const isAuthor = user?.nickname === nickname;

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
            refetchInteractions();
        });

    if (!isAuthenticated || isAuthor) {
        return (
            <Link href={`/@${nickname}`}>
                <a>
                    <button className="text-xs font-bold text-white py-1 w-32 rounded-full border-[1.5px] bg-gray-900 hover:bg-gray-800">
                        Ir al perfil
                    </button>
                </a>
            </Link>
        );
    }
    if (isFollowing) {
        return (
            <button
                className='text-xs font-bold py-1 w-32 rounded-full border-[1.5px] border-gray-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500 hover:before:content-["Dejar_de_seguir"] before:content-["Siguiendo"]'
                onClick={follow}
            />
        );
    }
    return (
        <button
            className="text-xs font-bold text-white py-1 w-32 rounded-full border-[1.5px] bg-gray-900 hover:bg-gray-800"
            onClick={follow}
        >
            Seguir
        </button>
    );
}
