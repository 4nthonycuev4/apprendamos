/** @format */

export function UpdateArticle(articleRef, body, tags) {
  Update(articleRef, {
    data: {
      body,
      tags,
      updated: true,
    },
  });
}
