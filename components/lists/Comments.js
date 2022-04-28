/** @format */

import Comment from "../items/Comment";

export default function CommentList({ comments = [] }) {
	return (
		<div className='space-y-2'>
			{comments && Object.values(comments).length > 1 ? (
				Object.values(comments).map(
					(e) =>
						e.comment && (
							<Comment
								key={e.comment.ref.id}
								comment={e.comment}
								author={e.author}
							/>
						)
				)
			) : (
				<h1>Sin comentarios...</h1>
			)}
		</div>
	);
}
