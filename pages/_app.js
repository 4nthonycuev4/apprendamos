/** @format */

import React from "react";
import useSWR, { SWRConfig } from "swr";

import { UserProvider } from "@auth0/nextjs-auth0";

import "../styles/app.css";
import Navbar from "../components/Navbar";

import moment from "moment";
import "moment/locale/es";
import Footer from "../components/Footer";

moment.updateLocale("es");

export default function MyApp({ Component, pageProps }) {
	return (
		<React.StrictMode>
			<UserProvider>
				<SWRConfig
					value={{
						refreshInterval: 5000,
						fetcher: (resource, init) =>
							fetch(resource, init).then((res) => res.json()),
					}}>
					<div className='w-full z-0'>
						<div className='max-w-2xl mx-auto border-x-2'>
							<Navbar />
							<main className='pt-1 pb-4 space-y-4 px-4 min-h-[90vh]'>
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
