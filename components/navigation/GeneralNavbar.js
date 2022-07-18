import Link from "next/link";
import Image from "next/image";

const GeneralNavbar = () => <div className="flex justify-between items-center text-gray-800">
    <Link href="/">
        <a className="flex items-center pt-1">
            <div className="relative h-5 w-5">
                <Image
                    src="/logo.svg"
                    alt="Picture of the author"
                    layout="fill"
                    objectFit="fill"
                    quality={20}
                    priority
                />
            </div>
            <h1 className="pl-2 text-xl">
                <span className="font-bold hover:text-blue-700">app</span>
                <span className="font-light">rendamos</span>
            </h1>
        </a>
    </Link>
    <div className="flex cursor-default space-x-6 font-semibold text-sm">
        <Link href="/about">
            <a>
                <span className="hover:text-blue-700">Acerca de</span>
            </a>
        </Link>
        <Link href="/privacy">
            <a>
                <span className="hover:text-blue-700">Privacidad</span>
            </a>
        </Link>
        <Link href="/contact">
            <a>
                <span className="hover:text-blue-700">Contacto</span>
            </a>
        </Link>
    </div>
</div>

export default GeneralNavbar;