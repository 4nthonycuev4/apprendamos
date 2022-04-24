/** @format */

import Link from "next/link";

export default function MorePage() {
	return (
		<div className='grid grid-cols-1 gap-3'>
			<Link href='/api/auth/logout'>
				<a>
					<button>Cerrar sesión</button>
				</a>
			</Link>
			<Link href='/settings/user'>
				<a>
					<button>Configuración</button>
				</a>
			</Link>
		</div>
	);
}
