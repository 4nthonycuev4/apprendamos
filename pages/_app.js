/** @format */

import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import moment from "moment";
import { SWRConfig } from "swr";

import "moment/locale/es";


import useDarkMode from "../hooks/useDarkMode";

import "../styles/app.css";
import Navbar from './../components/navigation/Navbar';
import Panel from './../components/navigation/Panel';

moment.updateLocale("es", {
  relativeTime: {
    future: "%s",
    past: "%s",
    s: "justo ahora",
    ss: "%s s",
    m: "1 min",
    mm: "%d min",
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
            revalidateOnFocus: false,
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json()),
          }}
        >
          <div className="w-screen h-screen dark:bg-gray-800 dark:text-white flex justify-center">
            <div className="w-1/4">
              <Navbar />
            </div>
            <main id="main" className="grow max-w-xl h-screen overflow-y-scroll border-x dark:scrollbar-dark pl-1">
              <Component {...pageProps} />
            </main>
            <div className="w-1/4 h-screen overflow-y-scroll scrollbar-light dark:scrollbar-dark">
              <Panel />
            </div>
          </div>
        </SWRConfig>
      </UserProvider>
    </React.StrictMode>
  );
}
