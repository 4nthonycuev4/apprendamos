import Image from "next/image";
import Link from "next/link";
import moment from "moment";

const NotificationCard = ({ body, ts, statusId, statusCollection, user, type }) => {
    return <div className="flex p-2 border-b">
        <Link href={`/@${user.username}`}>
            <a>
                <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-300 mr-2.5">
                    <Image
                        src={user.picture}
                        alt="Picture of the author"
                        layout="fill"
                        objectFit="fill"
                        quality={10}
                    />
                </div>
            </a>
        </Link>
        <Link href={`/${statusCollection}/${statusId}`}>
            <a>
                {
                    type === 'like' ? <p className="text-sm font-thin">A <span className="font-bold">@{user.username}</span> le gustó tu {statusCollection}: <span className="italic">{body}...</span> <span className="text-gray-500">{moment(ts).fromNow()}.</span></p> :
                        type === "save" ? <p className="text-sm font-thin"><span className="font-bold">@{user.username}</span> guardó tu {statusCollection}: <span className="italic">{body}...</span> <span className="text-gray-500">{moment(ts).fromNow()}.</span></p> : <p>zzz...</p>
                }
            </a>
        </Link>
    </div>
}

export default NotificationCard;