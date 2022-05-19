/** @format */

import Flashquiz from "../items/Flashquiz";
import Post from "../items/Post";

export default function Content({
  content,
  author,
}) {
  if (!content || content.length < 1) {
    return <h1 className="pt-2 px-6">No se encontró contenido :(</h1>;
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
                minimal
              />
            );
          if (x.ref.collection === "Posts")
            return (
              <Post
                key={x.ref.id}
                post={x}
                minimal
                author={author}
              />
            );
        })}
      </div>
    );
  }
  return (
    <div className="divide-y divide-gray-300 dark:divide-gray-600">
      {content.map((x) => {
        if (x.ref.collection === "Flashquizzes")
          return (
            <Flashquiz
              key={x.ref.id}
              flashquiz={x}
              author={x.author}
              minimal
            />
          );
        if (x.ref.collection === "Posts")
          return (
            <Post
              key={x.ref.id}
              post={x}
              author={x.author}
              minimal
            />
          );
      })}
    </div>
  );
}
