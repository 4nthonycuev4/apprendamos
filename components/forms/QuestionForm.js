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

  const [bodyHTML, setBodyHTML] = useState(question?.bodyHTML || null);
  const [bodyMD, setBodyMD] = useState(
    question?.bodyMD || `# Un buen título\nAlgo de texto ...`
  );
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
        data: { bodyMD, bodyHTML, tags },
        ref: question.ref,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));

    if (res.updated) {
      router.push(`/@/${author.username}/questions/${question.ref.id}/`);
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
          data: { bodyMD, bodyHTML, tags },
          type: "question",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((err) => console.error(err));

      router.push(`/@/${res.author.username}/questions/${res.content.ref.id}/`);
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
        router.push(`/@/${author.username}/`);
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
      <div className="rounded-lg border p-4">
        <article
          className="prose"
          dangerouslySetInnerHTML={{ __html: bodyHTML }}
        />
        <div className="h-2" />
        <Tags tags={tags} />
        <div className="mt-2 flex space-x-2 text-white ">
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
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <label className="mb-1 block text-sm font-bold text-gray-800">
        Cuerpo (
        {bodyMD.length < 50
          ? "escribe al menos 50 caracteres"
          : `${bodyMD.length}/2000`}
        )
      </label>
      <textarea
        type="text"
        id="body"
        rows="20"
        defaultValue={bodyMD}
        className="w-full resize-none rounded-lg border px-3 py-2 text-gray-700 focus:outline-none"
        placeholder="Debe comenzar con un título (# Un buen título...)"
        onChange={(e) => setBodyMD(e.target.value)}
      />

      <TagsInput tags={tags} handleOnTagsChange={setTags} />

      <div className="mt-2 flex space-x-2 text-white ">
        <button
          disabled={
            !bodyMD ||
            !bodyMD.startsWith("# ") ||
            bodyMD.length < 50 ||
            bodyMD.length > 2000
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
