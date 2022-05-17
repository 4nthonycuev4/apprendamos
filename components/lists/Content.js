/** @format */

import Flashquiz from "../items/Flashquiz";
import Post from "../items/Post";

export default function Content({
  content,
  author,
  minimal,
  showComments = false,
  commentInput = false,
}) {
  if (content.length < 1) {
    return <h1>Sin contenido</h1>;
  }
  if (author) {
    return (
      <div className="divide-y divide-gray-300 dark:divide-gray-600">
        {content.map((x) => {
          if (x.ref.collection === "Flashquizzes")
            return (
              <Flashquiz
                key={x.ref.id}
                flashquiz={x}
                author={author}
                minimal={minimal}
                commentInput={commentInput}
              />
            );
          if (x.ref.collection === "Posts")
            return (
              <Post
                key={x.ref.id}
                post={x}
                minimal={minimal}
                author={author}
                commentInput={commentInput}
              />
            );
        })}
      </div>
    );
  }
  return (
    <div className="divide-y divide-gray-300 dark:divide-gray-600">
      {content.map((x) => {
        if (x.content.ref.collection === "Flashquizzes")
          return (
            <Flashquiz
              key={x.content.ref.id}
              flashquiz={x.content}
              minimal={minimal}
              author={x.author}
              startViewerStats={x.viewerStats}
              comments={x.comments}
              showComments={showComments}
            />
          );
        if (x.content.ref.collection === "Posts")
          return (
            <Post
              key={x.content.ref.id}
              post={x.content}
              minimal={minimal}
              author={x.author}
              startViewerStats={x.viewerStats}
              comments={x.comments}
              showComments={showComments}
            />
          );
      })}
    </div>
  );
}
