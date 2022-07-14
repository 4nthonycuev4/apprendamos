
import Link from 'next/link';
import {
    ThumbUpIcon as ThumbUpIconOutline,
    HeartIcon as HeartIconOutline,
    AnnotationIcon as AnnotationIconOutline,
} from "@heroicons/react/outline";

const PublicationStats = ({ likeCount, cheerCount, commentCount, publicationId }) => (
    <div className="flex justify-between px-10">
        <Link href={`/p/${publicationId}`}>
            <a className="">
                <button className='px-2 text-sm font-semibold text-gray-600'>
                    Seguir leyendo
                </button>
            </a>
        </Link>
        <div className="flex justify-center space-x-8 cursor-default text-gray-600">
            <div className="flex ">
                <ThumbUpIconOutline strokeWidth={1.5} className="w-5" />
                <span>{likeCount || 0}</span>

            </div>
            <div className="flex ">
                <HeartIconOutline strokeWidth={1.5} className="w-5" />
                <span>{cheerCount || 0}</span>
            </div>
            <div className="flex ">
                <AnnotationIconOutline strokeWidth={1.5} className="w-5" />
                <span>{commentCount || 0}</span>
            </div>
        </div>
    </div>
)

export default PublicationStats;