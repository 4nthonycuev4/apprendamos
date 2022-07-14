import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";


const LandingPage = () => {
    const { user, loading } = useUser();
    const startUrl = !loading && user ? "/home" : "/api/auth/login";
    return (
        <div className="text-center space-y-8">
            <div className="font-extrabold text-5xl tracking-tight text-gray-800 pt-10">
                <h1>Porque aprender juntos es más divertido.</h1>
                <h1>Apprendamos.</h1>
            </div>
            <div className="relative w-xl h-80">
                <Image
                    src="/b-01.svg"
                    alt="oops..."
                    layout='fill'
                    objectFit='contain'
                    quality={100}
                    priority
                />
            </div>
            <div className="flex space-x-8 justify-center">
                <Link href={startUrl}>
                    <a>
                        <button className="w-40 h-10 rounded bg-blue-700 text-gray-100 border border-blue-700">
                            <span className="font-bold">¡Comencemos!</span>
                        </button>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;