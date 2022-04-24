/** @format */
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
export default function FlashquizOptionsPage() {
	const router = useRouter();
	const { user, error, isLoading } = useUser();
	const { username, flashquizId } = router.query;
	return (
		<div className='grid grid-cols-1 gap-2'>
			<Link href={`/@/${username}/flashquizzes/${flashquizId}`}>
				<button className='rounded-lg border mx-32 py-2 hover:bg-slate-100'>
					<a>Ir al flashquiz</a>{" "}
				</button>
			</Link>
			{!error && !isLoading && user?.username === username && (
				<Link href={`/@/${username}/flashquizzes/${flashquizId}/edit`}>
					<button className='rounded-lg border mx-32 py-2 hover:bg-slate-100'>
						<a>Editar o eliminar</a>{" "}
					</button>
				</Link>
			)}
			<Link href={`/@/${username}/flashquizzes/${flashquizId}/report`}>
				<button className='rounded-lg border mx-32 py-2 hover:bg-slate-100'>
					<a>Denunciar</a>
				</button>
			</Link>
			<button
				className='rounded-lg border mx-32 py-2 hover:bg-slate-100'
				onClick={() => router.back()}>
				Atrás
			</button>
		</div>
	);
}
