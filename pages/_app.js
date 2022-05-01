/** @format */

import React from "react";
import { SWRConfig } from "swr";

import { UserProvider } from "@auth0/nextjs-auth0";

import "../styles/app.css";
import Navbar from "../components/Navbar";

import moment from "moment";
import "moment/locale/es";

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
	return (
		<React.StrictMode>
			<UserProvider>
				<SWRConfig
					value={{
						refreshInterval: 30000,
						fetcher: (resource, init) =>
							fetch(resource, init).then((res) => res.json()),
					}}>
					<div className='w-full z-0'>
						<div className='max-w-2xl mx-auto border-x-2'>
							<Navbar />
							<main className='pt-1 pb-4 space-y-4 px-4'>
								<Component {...pageProps} />
							</main>
						</div>
					</div>
				</SWRConfig>
			</UserProvider>
		</React.StrictMode>
	);
}
