import Link from "next/link";

const GeneralNavbar = () => <div className="flex justify-between items-center text-gray-800">
    <Link href="/">
        <a>
            <span>\r</span>
            <span className="font-bold text-lg">apprendamos</span>
        </a>
    </Link>
    <div className="flex cursor-default space-x-6 font-semibold text-sm">
        <Link href="/about">
            <a>
                <span>Acerca de</span>
            </a>
        </Link>
        <Link href="/privacy">
            <a>
                <span>Privacidad</span>
            </a>
        </Link>
        <Link href="/contact">
            <a>
                <span>Contacto</span>
            </a>
        </Link>
    </div>
</div>

export default GeneralNavbar;