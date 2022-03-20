/** @format */

import Tag from "../items/Tag";

export default function TagList({ tags }) {
	return (
		<div className='flex self-center mb-1'>
			{tags?.length > 0 && tags.map((tag) => <Tag tag={tag} key={tag} />)}
		</div>
	);
}
