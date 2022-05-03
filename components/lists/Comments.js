/** @format */
import { useEffect, useState, useRef } from "react";
import CommentOptionsModal from "../CommentOptionsModal";
import Comment from "../items/Comment";

export default function CommentList({ comments, minimal, viewer }) {
	const [commentSelected, setCommentSelected] = useState(null);

	return (
		<div className='space-y-2'>
			{Object.keys(comments).map((key) => {
				if (comments[key].comment) {
					return (
						<Comment
							key={comments[key].comment.ref.id}
							comment={comments[key].comment}
							author={comments[key].author}
							minimal={minimal}
							selectComment={setCommentSelected}
						/>
					);
				}
			})}
			{commentSelected && (
				<CommentOptionsModal
					onClose={() => setCommentSelected(null)}
					comment={commentSelected}
					viewer={viewer}
				/>
			)}
		</div>
	);
}
