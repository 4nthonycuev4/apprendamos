/** @format */

import { PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";

export default function AddCardButton({ quizId }) {
    return (
        <Link href={`/q/${quizId}/c/create`}>
            <button className="mx-4 mb-2">
                <div className="flex items-center rounded-full bg-green-100 p-2 pr-4">
                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-200">
                        <PlusIcon width={16} />
                    </div>
                    <span>Añadir carta</span>
                </div>
            </button>
        </Link>
    );
}
