/** @format */

import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import moment from "moment";
import { SWRConfig } from "swr";

import "moment/locale/es";

import Footer from "../components/navigation/Footer";
import useDarkMode from "../hooks/useDarkMode";

import "../styles/app.css";

moment.updateLocale("es", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "justo ahora",
    ss: "%ss",
    m: "1 min",
    mm: "%dm",
    h: "1 hora",
    hh: "%dh",
    d: "1 día",
    dd: "%dd",
    M: "1 mes",
    MM: "%dM",
    y: "1 año",
    yy: "%da",
  },
});

export default function MyApp({ Component, pageProps }) {
  useDarkMode();
  return (
    <React.StrictMode>
      <UserProvider>
        <SWRConfig
          value={{
            refreshInterval: 30000,
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json()),
          }}
        >
          <div className="max-w-screen min-h-screen dark:bg-neutral-900">
            <div className="mx-auto flex min-h-screen max-w-xl flex-col dark:bg-gray-900 dark:text-slate-300 ">
              <main className="h-full flex-grow bg-gray-100 text-slate-800 dark:bg-gray-800 dark:text-white">
                <Component {...pageProps} />
              </main>
              <Footer />
            </div>
          </div>
        </SWRConfig>
      </UserProvider>
    </React.StrictMode>
  );
}
