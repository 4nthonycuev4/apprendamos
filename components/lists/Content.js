/** @format */

import Memorama from "../items/Memorama";
import Article from "../items/Article";
import Question from './../items/Question';
import FullAuthorCard from './../items/FullAuthorCard';

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
          if (x.faunaRef.collection === "memoramas")
            return (
              <Memorama
                key={x.faunaRef.id}
                {...x}
                author={author}
                minimal
              />
            );
          if (x.faunaRef.collection === "articles")
            return (
              <Article
                key={x.faunaRef.id}
                {...x}
                minimal
                author={author}
              />
            );
          if (x.faunaRef.collection === "questions")
            return (
              <Question
                key={x.faunaRef.id}
                {...x}
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
        if (x.username)
          return (
            <div key={x.username} className="px-6 py-2">
              <FullAuthorCard
                author={x}
              /></div>
          );
        if (x.faunaRef.collection === "memoramas")
          return (
            <Memorama
              key={x.faunaRef.id}
              {...x}
              author={x.author}
              minimal
            />
          );
        if (x.faunaRef.collection === "articles")
          return (
            <Article
              key={x.faunaRef.id}
              {...x}
              author={x.author}
              minimal
            />
          );
        if (x.faunaRef.collection === "questions")
          return (
            <Question
              key={x.faunaRef.id}
              {...x}
              author={x.author}
              minimal
            />
          );

      })}
    </div>
  );
}
