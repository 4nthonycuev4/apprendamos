/** @format */

import React from "react";

import { UserProvider } from "@auth0/nextjs-auth0";

import "../styles/app.css";
import Navbar from "../components/Navbar";

import moment from "moment";
import "moment/locale/es";
import Footer from "../components/Footer";

moment.updateLocale("es", {
	relativeTime: {
		future: "in %s",
		past: "hace %s",
		s: "segundos",
		ss: "%s seg",
		m: "1 min",
		mm: "%d min",
		h: "1 hora",
		hh: "%d horas",
		d: "1 día",
		dd: "%d días",
		M: "1 mes",
		MM: "%d mes",
		y: "1 año",
		yy: "%d años",
	},
});

export default function MyApp({ Component, pageProps }) {
	return (
		<React.StrictMode>
			<UserProvider>
				<Navbar />
				<div className='w-full z-0'>
					<div className='max-w-2xl mx-auto border-x'>
						<main className='mx-1 border-x min-h-[91vh] pt-1 pb-4'>
							<Component {...pageProps} />
						</main>
					</div>
				</div>
				<Footer />
			</UserProvider>
		</React.StrictMode>
	);
}
