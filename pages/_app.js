/** @format */

import { UserProvider } from "@auth0/nextjs-auth0";
import "../styles/app.css";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
	return (
		<UserProvider>
			<div className='bg-red-600 w-full p-10 min-h-screen'>
				<div className='max-w-2xl mx-auto'>
					<Navbar />
					<Component {...pageProps} />
				</div>
			</div>
		</UserProvider>
	);
}

export default MyApp;
