import React from "react";
import { useRouter } from "next/router";
import { UserProvider } from "@auth0/nextjs-auth0";
import moment from "moment";
import { SWRConfig } from "swr";

import "moment/locale/es";

import useDarkMode from "hooks/useDarkMode";

import "../styles/app.css";
import Navbar from "components/navigation/Navbar";
import GeneralNavbar from "components/navigation/GeneralNavbar";
import Panel from "components/navigation/Panel";
import MobileNavbar from "components/navigation/MobileNavbar";

moment.updateLocale("es", {
    relativeTime: {
        future: "en %s",
        past: "hace %s",
        s: "instantes",
        ss: "%d segundos",
        m: "1 minuto",
        mm: "%d minutos",
        h: "1 hora",
        hh: "%d horas",
        d: "1 día",
        dd: "%d días",
        M: "1 mes",
        MM: "%d meses",
        y: "1 año",
        yy: "%d años",
    },
});

const ComponentHandler = ({ Component, pageProps }) => {
    const router = useRouter();
    const { route } = router;
    if (
        route === "/home" ||
        route === "/p/[id]" ||
        route === "/[rawUsername]" ||
        route === "/trending" ||
        route === "/search" ||
        route === "/notifications" ||
        route === "/saved"
    ) {
        return (
            <>
                <div className="hidden sm:flex xl:grow xl:max-w-[18rem] sticky h-screen top-0 xl:overflow-auto">
                    <Navbar />
                </div>
                <main
                    id="main"
                    className="w-full flex flex-col md:grow md:max-w-[36rem] sm:border-x min-h-[101vh]"
                >
                    <Component {...pageProps} />
                    <div className="grow" />
                    <MobileNavbar />
                </main>
                <div className="hidden lg:block grow max-w-[18rem] sticky h-screen top-0 overflow-auto pl-4">
                    <Panel />
                </div>
            </>
        );
    }
    if (route === "/more" || route === "/drafts" || route === "/drafts/[id]") {
        return (
            <>
                <div className="hidden sm:block xl:grow xl:max-w-[18rem] sticky h-screen top-0 xl:overflow-auto">
                    <Navbar />
                </div>
                <main
                    id="main"
                    className="w-full flex flex-col md:grow md:max-w-[54rem] border-x min-h-[101vh]"
                >
                    <Component {...pageProps} />
                    <div className="grow" />
                    <MobileNavbar />
                </main>
            </>
        );
    }
    if (
        route === "/about" ||
        route === "/contact" ||
        route === "/terms" ||
        route === "/privacy" ||
        route === "/cookies" ||
        route === "/faq" ||
        route === "/help" ||
        route === "/"
    ) {
        return (
            <>
                <main
                    id="main"
                    className="flex flex-col grow max-w-6xl min-h-[150vh]"
                >
                    <GeneralNavbar />
                    <Component {...pageProps} />
                </main>
            </>
        );
    }
    if (
        route === "/signup/step-2" ||
        route === "/signup/step-3" ||
        route === "/settings/profile"
    ) {
        return (
            <>
                <main id="main" className="grow max-w-2xl">
                    <Component {...pageProps} />
                </main>
            </>
        );
    }
    return (
        <>
            <main id="main" className="grow max-w-5xl min-h-[150vh]">
                <Component {...pageProps} />
            </main>
        </>
    );
};

export default function MyApp({ Component, pageProps }) {
    useDarkMode();

    return (
        <React.StrictMode>
            <UserProvider>
                <SWRConfig
                    value={{
                        revalidateOnFocus: false,
                        fetcher: (resource, init) =>
                            fetch(resource, init).then((res) => res.json()),
                    }}
                >
                    <div className="dark:bg-black text-gray-800 dark:text-white dark:[color-scheme:dark]">
                        <div className="min-h-screen mx-auto flex justify-center dark:[color-scheme:dark] sm:px-2">
                            <ComponentHandler
                                Component={Component}
                                pageProps={pageProps}
                            />
                        </div>
                    </div>
                </SWRConfig>
            </UserProvider>
        </React.StrictMode>
    );
}
