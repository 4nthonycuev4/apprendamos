import { useEffect, useState } from "react";

export default function FollowButton({ username }) {
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const getFollowing = async () => {
      const followingStatus = await fetch("/api/interactions/user/following", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
        }),
      }).then((res) => res.json());
      setFollowing(followingStatus);
    };
    getFollowing();
  }, []);

  const toggleFollow = async () => {
    const newFollowingStatus = await fetch("/api/interactions/user/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    }).then((res) => res.json());
    setFollowing(newFollowingStatus.viewerStats.following);
  };

  if (following) {
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
      className="h-6 w-20 rounded bg-red-600 text-xs font-semibold text-white"
      onClick={toggleFollow}
    >
      Seguir
    </button>
  );
}
