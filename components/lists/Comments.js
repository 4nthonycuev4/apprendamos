/** @format */

import Comment from "../items/Comment";

export default function CommentList({ comments }) {
	return (
		<div className='space-y-2'>
			{comments.map(
				(e) =>
					e.comment && (
						<Comment
							key={e.comment.ref.id}
							comment={e.comment}
							author={e.author}
						/>
					)
			)}
		</div>
	);
}
