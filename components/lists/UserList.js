/** @format */

import UserCard from "../items/User";

export default function UserList({ users, setOpen }) {
	return (
		<div className=''>
			{users.map((user) => (
				<div key={user.id} className='mb-3 border-b-2'>
					<UserCard user={user} setOpen={setOpen} />
				</div>
			))}
		</div>
	);
}
