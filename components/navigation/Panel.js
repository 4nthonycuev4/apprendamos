/** @format */

import useSWRInfinite from 'swr/infinite'
import BasicAuthorCard from './../items/BasicAuthorCard';

export default function Panel() {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null
        if (pageIndex === 0) return '/api/users'
        return `/api/users?after=${previousPageData.after}`
    }
    const { data: userPages, size, setSize, error } = useSWRInfinite(getKey)

    return (
        <div
            className="
                flex flex-col
                w-max mr-auto ml-10
                justify-right
				py-2 space-y-6
                font-bold text-xl"
        >
            <h1>Usuarios sugeridos</h1>
            {
                error ? <div className="mx-6">Hubo un error :(</div> :
                    !userPages ? <div className="mx-6">Cargando ...</div> : (<>
                        {userPages.map((page) => (
                            page.data.map(user => <BasicAuthorCard key={user.username} {...user} />)
                        ))}
                        <div className="flex justify-center">
                            <button className="w-32 h-8 bg-cyan-500 rounded text-white disabled:hidden" disabled={!userPages.at(-1)?.after} onClick={() => setSize(size + 1)}>
                                Mostrar más
                            </button>
                        </div></>)
            }
        </div>
    );
}
