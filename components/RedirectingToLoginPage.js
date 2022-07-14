import Image from "next/image";

const RedirectingToLoginPage = () => (
    <div className='flex flex-col justify-center h-screen items-center'>
        <div className="relative h-[375px] w-[488px]">
            <Image
                src="/doggie.png"
                alt="Picture of the author"
                layout="fill"
                objectFit="fill"
                quality={100}
            />
        </div>
        <div className='text-center mt-4 w-1/2 space-y-2'>
            <h1 className="text-4xl font-bold">
                ¡Necesitas iniciar sesión para ver esta página!
            </h1>
            <p className="text-xl">
                Bienvenido a Apprendamos. Esta página es para uso exclusivo de usuarios registrados. Serás redirigido a la página de inicio de sesión. Una vez que inicies sesión podrás ver esta página. Si no tienes una cuenta, puedes crearla en la página de inicio.
            </p>
        </div>
    </div>
)

export default RedirectingToLoginPage;