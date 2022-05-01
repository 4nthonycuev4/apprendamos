/** @format */

import Comment from "../items/Comment";

export default function CommentList({ comments }) {
	return (
		<div className='space-y-2'>
			{Object.keys(comments).map((key) => {
				if (comments[key].comment) {
					return (
						<Comment
							key={comments[key].comment.ref.id}
							comment={comments[key].comment}
							author={comments[key].author}
						/>
					);
				}
			})}
		</div>
	);
}
