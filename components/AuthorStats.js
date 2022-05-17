/** @format */

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

export default function AuthorStats({ startStats, username }) {
  const [viewerStats, setViewerStats] = useState({ following: false });
  const [stats, setStats] = useState(startStats);

  const { user } = useUser();

  useEffect(() => {
    const getViewerStats = async () => {
      const res = await fetch("/api/interactions/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
        }),
      })
        .then((resx) => resx.json())
        .catch((err) => console.log(err));
      setViewerStats(res);
    };

    if (!viewerStats?.ref && user?.ref) {
      getViewerStats();
    }
  });

  const follow = async () => {
    try {
      const resx = await fetch("/api/interactions/user/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
        }),
      }).then((res) => res.json());

      setStats(resx.stats);
      setViewerStats(resx.viewerStats);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {user && user.username === username ? (
        <button
          type="button"
          className="h-6 w-32 rounded bg-gradient-to-r from-sky-500 to-purple-500 px-4 text-sm font-normal text-white hover:from-sky-600 hover:to-purple-600"
        >
          <Link href="/settings">
            <a>Editar perfil</a>
          </Link>
        </button>
      ) : viewerStats.following ? (
        <button
          type="button"
          disabled={!user}
          onClick={follow}
          className="h-6 w-32 rounded bg-gradient-to-r from-pink-500 to-red-500 px-4 text-sm font-normal text-white hover:from-pink-600 hover:to-red-600"
        >
          Siguiendo
        </button>
      ) : (
        <button
          type="button"
          disabled={!user}
          onClick={follow}
          className="h-6 w-32 rounded bg-black px-4 text-sm font-normal text-white hover:bg-slate-800"
        >
          Seguir
        </button>
      )}
      <div className="flex justify-center space-x-4">
        <h1 className="font-bold">
          {stats.followers}
          <span className="font-normal"> Seguidores</span>
        </h1>

        <h1 className="font-bold">
          {stats.following}
          <span className="font-normal"> Siguiendo</span>
        </h1>

        <h1 className="font-bold">
          {stats.received.likes}
          <span className="font-normal"> Likes</span>
        </h1>
      </div>
    </div>
  );
}
