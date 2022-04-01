/** @format */

import UserCard from "../items/User";

export default function UserList({ users }) {
	return users?.length > 0 ? (
		<div className='grid grid-cols-1 gap-1'>
			{users.map((user) => (
				<UserCard user={user} key={user.id} />
			))}
		</div>
	) : (
		<h1>Sin seguidores :(</h1>
	);
}
