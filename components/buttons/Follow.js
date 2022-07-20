import useSWR from "swr";
export default function FollowButton({ username }) {
    const { data, mutate } = useSWR(`/api/users/${username}/following`);

    const toggleFollow = async () => {
        const newData = await fetch(`/api/users/${username}/follow`).then(
            (res) => res.json()
        );
        mutate(newData, false);
    };

    if (data && data.following) {
        return (
            <button
                type="button"
                className="h-6 w-20 rounded bg-black text-xs font-semibold text-white"
                onClick={toggleFollow}
            >
                Siguiendo
            </button>
        );
    }
    return (
        <button
            type="button"
            className="h-6 w-20 rounded bg-blue-700 text-xs font-semibold text-white"
            onClick={toggleFollow}
        >
            Seguir
        </button>
    );
}
