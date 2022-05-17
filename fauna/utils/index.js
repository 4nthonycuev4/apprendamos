/** @format */
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export function ParseDocType(ref) {
  return ref.collection === "Flashquizzes"
    ? "flashquiz"
    : ref.collection.slice(0, -1).toLowerCase();
}

export function FaunaToJSON(obj) {
  if (Array.isArray(obj)) {
    return obj.map((e) => FaunaToJSON(e));
  }
  if (typeof obj === "object") {
    if (Object.keys(obj).length === 1 && obj.data && Array.isArray(obj.data)) {
      return FaunaToJSON(obj.data);
    }
    if (obj.collection && obj.id) {
      return {
        collection: obj.collection.id,
        id: obj.id,
      };
    }
    if (obj.value) {
      return obj.value;
    }
    Object.keys(obj).forEach((k) => {
      if (k === "data") {
        const d = obj[k];
        delete obj.data;

        Object.keys(d).forEach((dataKey) => {
          obj[dataKey] = FaunaToJSON(d[dataKey]);
        });
      } else if (obj[k] === null || obj[k] === undefined) {
        delete obj[k];
      } else {
        obj[k] = FaunaToJSON(obj[k]);
      }
    });

    return obj;
  }
  return obj;
}

export async function MDtoHTML(md) {
  const html = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(md);

  return String(html);
}

export function ParseTags(tags) {
  if (!/^[A-Za-z0-9,_-]*$/.test(tags)) {
    return null;
  }
  const parsedtags = tags.split(",");
  return parsedtags;
}
