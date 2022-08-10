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
    const { data, error } = useSWRInfinite(getKey);

    const authors =
        data && data[0].data
            ? [].concat(...data?.map((page) => [].concat(...page?.data)))
            : [];

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
            ) : !authors ? (
                <div className="mx-6">Cargando ...</div>
            ) : (
                <>
                    {authors.map((page) =>
                        page.data.map((author) => (
                            <BasicAuthorCard
                                key={author.nickname}
                                {...author}
                            />
                        ))
                    )}
                </>
            )}
        </div>
    );
};

const PanelNoAuth = () => <h1>Panel no auth</h1>;

const Panel = () => {
    // const { user } = useUser();

    // if (user && user?.nickname) return <PanelAuth />;
    return <PanelNoAuth />;
};

export default Panel;
