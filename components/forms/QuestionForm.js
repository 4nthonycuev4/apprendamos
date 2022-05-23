/** @format */
import { useState } from "react";
import { useRouter } from "next/router";


import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import { unified } from "unified";

import DeleteModal from "../DeleteModal";
import Tags from "../Tags";
import TagsInput from "../TagsInput";

const defaultTags = [{ parsed: "hello_w0rld", raw: "Hello w0rld" }];

async function MDtoHTML(md) {
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

export default function QuestionForm({ question, author }) {
  const router = useRouter();

  const [title, setTitle] = useState(question ? question?.title : "");

  const [bodyHTML, setBodyHTML] = useState(question?.body || null);
  const [bodyMD, setBodyMD] = useState(question?.bodyMD || null);

  const [tags, setTags] = useState(question?.tags || defaultTags);

  const [sending, setSending] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handlePreview = async () => {
    if (previewing) {
      setPreviewing(false);
    } else {
      const html = await MDtoHTML(bodyMD);
      setBodyHTML(html);
      setPreviewing(true);
    }
  };

  const updateQuestion = async () => {
    setSending(true);
    const res = await fetch("/api/content/update", {
      method: "PUT",
      body: JSON.stringify({
        data: { title, bodyMD, body: bodyHTML, tags },
        ref: question.ref,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));

    if (res.updated) {
      router.push(`/p/${question.ref.id}/`);
    } else {
      console.error("Error updating question");
    }
  };

  const createQuestion = async () => {
    try {
      setSending(true);
      const res = await fetch("/api/content/create", {
        method: "POST",
        body: JSON.stringify({
          data: { title, bodyMD, body: bodyHTML, tags },
          type: "question",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((err) => console.error(err));

      router.push(`/${res.author.username}/p/${res.content.ref.id}/`);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuestion = async () => {
    try {
      const res = await fetch("/api/content/delete", {
        method: "DELETE",

        body: JSON.stringify({
          ref: question.ref,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((err) => console.error(err));

      if (res.deleted) {
        router.push(`/`);
      } else {
        console.error("Error eliminando question");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = () => {
    if (question) {
      updateQuestion();
    } else {
      createQuestion();
    }
  };

  if (previewing && bodyHTML) {
    return (
      <article className="rounded-lg p-4">
        <h1 className="pb-6 text-3xl font-black tracking-tight">{title}</h1>
        <div
          className="prose mb-2 prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: bodyHTML }}
        />
        <div className="h-2" />
        <Tags tags={tags} disabled />
        <div className="mt-2 flex space-x-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={sending}
            className="w-40 rounded bg-gradient-to-r from-sky-500 to-purple-500  py-2 px-4 font-bold hover:from-sky-600 hover:to-purple-600 disabled:from-slate-400 disabled:to-slate-700 hover:disabled:from-slate-500 hover:disabled:to-gray-800"
          >
            {sending ? "Enviando..." : question ? "Actualizar" : "Crear"}
          </button>
          <button
            type="button"
            onClick={handlePreview}
            className="w-40 rounded bg-gradient-to-r from-sky-500 to-green-500  py-2 px-4 font-bold hover:from-sky-600 hover:to-green-600"
          >
            Seguir editando
          </button>
        </div>
      </article>
    );
  }

  return (
    <div className="rounded-lg px-6 py-2">
      <label className="text-sm font-bold">Título</label>
      <input
        type="text"
        placeholder="La pregunta debe tener un título para poder ser encontrada"
        defaultValue={title}
        className="mb-4 w-full rounded-lg dark:bg-gray-700"
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="text-sm font-bold">Cuerpo</label>
      <textarea
        type="text"
        id="body"
        rows="20"
        defaultValue={bodyMD}
        className="w-full resize-none rounded-lg border px-3 py-2 focus:outline-none
				dark:bg-gray-700
				"
        placeholder="Brinda más detalles sobre tu pregunta. Puedes adjuntar imágenes, links, tablas, etc. Recuerda seguir la sintaxis Markdown."
        onChange={(e) => setBodyMD(e.target.value.trim())}
      />

      <TagsInput tags={tags} handleOnTagsChange={setTags} />

      <table className="my-4 w-full table-auto border-collapse border border-slate-500">
        <thead>
          <tr>
            <th className="border border-slate-600">Requisito</th>
            <th className="border border-slate-600">Valor actual</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-700 px-2">
              Título entre 3 y 10 palabras
            </td>
            <td className="border border-slate-700 px-2 text-center">
              {title.trim().split(/\s+/).length}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-600 px-2">Cuerpo sin títulos H1 (# ...)</td>
            <td className="border border-slate-600 px-2 text-center">
              {bodyMD && bodyMD
                .split(/\n/)
                .some(
                  (line) =>
                    line.startsWith("# ") ||
                    line.startsWith(" # ") ||
                    line.startsWith("  # ") ||
                    line.startsWith("   # ")
                )
                ? "No cumple"
                : "Cumple"}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-600 px-2">
              Cuerpo entre 15 y 2000 palabras
            </td>
            <td className="border border-slate-600 px-2 text-center">
              {bodyMD?.trim().split(/\s+/).length}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-600 px-2">Máximo 8 tags</td>
            <td className="border border-slate-600 px-2 text-center">
              {tags.length}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-2 flex space-x-2 text-white ">
        <button
          disabled={
            !bodyMD ||
            !title ||
            bodyMD
              .split(/\n/)
              .some(
                (line) =>
                  line.startsWith("# ") ||
                  line.startsWith(" # ") ||
                  line.startsWith("  # ") ||
                  line.startsWith("   # ")
              ) ||
            bodyMD.trim().split(/\s+/).length < 15 ||
            bodyMD.trim().split(/\s+/).length > 2000 ||
            title.trim().split(/\s+/).length < 3 ||
            title.trim().split(/\s+/).length > 10 ||
            tags.length > 8
          }
          type="button"
          onClick={handlePreview}
          className="w-40 rounded bg-gradient-to-r from-sky-500 to-green-500  py-2 px-4 font-bold hover:from-sky-600 hover:to-green-600 disabled:from-slate-400 disabled:to-slate-700 hover:disabled:from-slate-500 hover:disabled:to-gray-800"
        >
          Preview
        </button>
        {question && (
          <button
            type="button"
            onClick={() => {
              setDeleteModalOpen(true);
            }}
            className="w-40 rounded bg-gradient-to-r from-pink-500 to-red-500  py-2 px-4 font-bold hover:from-pink-600 hover:to-red-600"
          >
            Eliminar
          </button>
        )}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          onClose={() => {
            setDeleteModalOpen(false);
          }}
          onDelete={deleteQuestion}
        />
      )}
    </div>
  );
}