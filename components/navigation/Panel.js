/** @format */

import useSWRInfinite from "swr/infinite";
import BasicAuthorCard from "../items/AuthorCard/Basic";
import { useUser } from "@auth0/nextjs-auth0";

const PanelAuth = () => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null;
        if (pageIndex === 0) return "/api/authors/trending";
        return `/api/authors/trending?after=${previousPageData.afterId}`;
    };
    const { data: userPages, size, setSize, error } = useSWRInfinite(getKey);

    return (
        <div
            className="
                flex flex-col
				space-y-4
                font-bold text-xl"
        >
            <h1>Usuarios sugeridos</h1>
            {error ? (
                <div className="mx-6">Hubo un error :(</div>
            ) : !userPages ? (
                <div className="mx-6">Cargando ...</div>
            ) : (
                <>
                    {userPages.map((page) =>
                        page.data.map((user) => (
                            <BasicAuthorCard key={user.username} {...user} />
                        ))
                    )}
                </>
            )}
        </div>
    );
};

const PanelNoAuth = () => <h1>Panel no auth</h1>;

const Panel = () => {
    const { user } = useUser();

    if (user && user?.username) return <PanelAuth />;
    return <PanelNoAuth />;
};

export default Panel;
