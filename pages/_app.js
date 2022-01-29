/** @format */

import { UserProvider } from "@auth0/nextjs-auth0";
import "../styles/app.css";
import Navbar from "../components/Navbar";
import { AiFillHeart } from "react-icons/ai";
function MyApp({ Component, pageProps }) {
	return (
		<UserProvider>
			<div className='bg-red-600 w-full p-10 min-h-screen'>
				<div className='max-w-2xl mx-auto'>
					<Navbar />
					<Component {...pageProps} />
					<footer className='mt-5'>
						<h1 className='text-white text-xs text-center'>
							Made with 🤍 by Daneel's human
						</h1>
					</footer>
				</div>
			</div>
		</UserProvider>
	);
}

export default MyApp;
