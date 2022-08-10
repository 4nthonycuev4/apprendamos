import Link from "next/link";
import {
    ThumbUpIcon as ThumbUpIconOutline,
    HeartIcon as HeartIconOutline,
    AnnotationIcon as AnnotationIconOutline,
} from "@heroicons/react/outline";

const PublicationStats = ({
    like_count,
    cheer_count,
    comment_count,
    publication_id,
}) => (
    <div className="flex justify-between px-10">
        <Link href={`/p/${publication_id}`}>
            <a className="">
                <button className="px-2 text-sm font-semibold text-gray-600">
                    Seguir leyendo
                </button>
            </a>
        </Link>
        <div className="flex justify-center space-x-8 cursor-default text-gray-600">
            <div className="flex ">
                <ThumbUpIconOutline strokeWidth={1.5} className="w-5" />
                <span>{like_count || 0}</span>
            </div>
            <div className="flex ">
                <HeartIconOutline strokeWidth={1.5} className="w-5" />
                <span>{cheer_count || 0}</span>
            </div>
            <div className="flex ">
                <AnnotationIconOutline strokeWidth={1.5} className="w-5" />
                <span>{comment_count || 0}</span>
            </div>
        </div>
    </div>
);

export default PublicationStats;
