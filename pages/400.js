import { useRouter } from "next/router";

const Error400Page = () => {
    const router = useRouter();
    const { fromUrl } = router.query;
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Error 400</h1>
            <h1 className="text-2xl font-bold">Dirección incorrecta</h1>

            <p>
                La dirección consultada es inválida. Probablemente haya
                ingresado un ID incorrecto.
            </p>
            <p className="font-bold">{fromUrl}</p>
        </div>
    );
};
export default Error400Page;
