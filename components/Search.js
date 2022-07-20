/** @format */

import { useState } from "react";
import { SearchIcon, TagIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Search() {
    const router = useRouter();

    const [search, setSearch] = useState("");

    return (
        <div className="relative flex h-12 w-64 items-center overflow-hidden rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
            <div className="flex items-center justify-center px-3">
                <TagIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
                type="search"
                name="search"
                id="search"
                className="w-2/3 outline-none"
                placeholder="Buscar por tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        router.push(`/tags/${search}`);
                    }
                }}
            />
            <div className="h-full">
                <Link href={`/t/${search.toLowerCase()}`}>
                    <a>
                        <div className="flex h-full cursor-pointer items-center justify-center bg-gray-200 px-5">
                            <SearchIcon className="h-5 w-5 text-gray-500" />
                        </div>
                    </a>
                </Link>
            </div>
        </div>
    );
}
