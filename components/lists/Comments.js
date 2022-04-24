/** @format */
import useSWR from "swr";

import Comment from "../items/Comment";
import CommentForm from "../forms/CommentForm";

export default function CommentList({ contentRef }) {
	const fetcher = (url) =>
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ref: contentRef,
			}),
		}).then((res) => res.json());

	const { data: comments, error } = useSWR(`/api/comments`, fetcher);

	return (
		<div className='space-y-4 p-4 rounded-lg border'>
			<h1 className='font-bold'>Comentarios</h1>
			<CommentForm contentRef={contentRef} />
			{!error &&
				comments &&
				comments.map((comment) => (
					<Comment key={comment.ref.id} comment={comment} />
				))}
		</div>
	);
}
