import Image from "next/image";
import Link from "next/link";
import moment from "moment";

const Notification = ({ body, ts, statusFref, interactor, alert }) => {
    const myHref =
        statusFref?.collection === "publications"
            ? `/p/${statusFref.id}`
            : `/@${interactor.nickname}`;
    return (
        <div className="flex p-2 border-b items-center">
            <Link href={`/@${interactor.nickname}`}>
                <a>
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-300 mr-2.5">
                        <Image
                            src={interactor.picture}
                            alt="Picture of the author"
                            layout="fill"
                            objectFit="fill"
                            quality={10}
                        />
                    </div>
                </a>
            </Link>
            <Link href={myHref}>
                <a>
                    {alert === "like" ? (
                        <p className="text-sm ">
                            A{" "}
                            <span className="font-bold">
                                @{interactor.nickname}
                            </span>{" "}
                            le gustó tu {statusFref.collection}:{" "}
                            <span className="italic">{body}...</span>{" "}
                            <span className="text-gray-500">
                                {moment(ts).fromNow()}.
                            </span>
                        </p>
                    ) : alert === "save" ? (
                        <p className="text-sm ">
                            <span className="font-bold">
                                @{interactor.nickname}
                            </span>{" "}
                            guardó tu {statusFref.collection}:{" "}
                            <span className="italic">{body}...</span>{" "}
                            <span className="text-gray-500">
                                {moment(ts).fromNow()}.
                            </span>
                        </p>
                    ) : alert === "follow" ? (
                        <p className="text-sm ">
                            <span className="font-bold">
                                @{interactor.nickname}
                            </span>{" "}
                            ha comenzado a seguirte.{" "}
                            <span className="text-gray-500">
                                {moment(ts).fromNow()}.
                            </span>
                        </p>
                    ) : (
                        ""
                    )}
                </a>
            </Link>
        </div>
    );
};

export default Notification;
