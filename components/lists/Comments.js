/** @format */
import { useEffect, useRef, useState } from "react";

import CommentOptionsModal from "../CommentOptionsModal";
import Comment from "../items/Comment";

export default function CommentList({ comments, minimal, viewer }) {
  const [commentSelected, setCommentSelected] = useState(null);

  if (!comments || comments.length === 0) {
    return <p>Sin comentarios</p>;
  }

  return (
    <div className="space-y-2">
      {Object.keys(comments).map((key) => {
        if (comments[key].ref) {
          return (
            <Comment
              key={comments[key].ref.id}
              comment={comments[key]}
              author={comments[key].author}
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
