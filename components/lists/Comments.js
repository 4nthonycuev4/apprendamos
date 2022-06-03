/** @format */
import { useEffect, useState } from "react";

import CommentOptionsModal from "../CommentOptionsModal";
import Comment from "../items/Comment";

export default function CommentList({ contentRef, viewer }) {
  const [comments, setComments] = useState(null);
  const [afterRef, setAfterRef] = useState(null);
  const [commentSelected, setCommentSelected] = useState(null);

  useEffect(() => {
    const getComments = async () => {
      const comments = await fetch(`/api/${contentRef.collection}/${contentRef.id}/comments`)
        .then((res) => res.json())
        .catch((err) => console.log(err));

      setComments(comments.data);
      setAfterRef(comments.afterRef);
    };
    getComments();
  }, []);

  const getNextComments = async () => {
    const nextComments = await fetch(`/api/${contentRef.collection}/${contentRef.id}/comments?afterId=${afterRef.id}`)
      .then((res) => res.json())
      .catch((err) => console.log(err));

    setComments(comments.concat(nextComments.data));
    setAfterRef(nextComments.afterRef);
  };

  if (!comments || comments.length === 0) {
    return <p>Sin comentarios</p>;
  }

  return (
    <div className="space-y-2">
      {comments.map((comment) => {
        return (
          <Comment
            key={comment.id}
            comment={comment}
            author={comment.author}
            selectComment={setCommentSelected}
          />
        );

      })}
      {afterRef && afterRef.id && (
        <button

          type="button"
          onClick={getNextComments}>más comentario</button>)
      }
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
