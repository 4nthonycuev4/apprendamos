/** @format */

import { useState } from "react";
import { useRouter } from "next/router";

import DeleteModal from "../DeleteModal";
import FlashcardList from "../lists/FlashcardList";
import TagsInput from "../TagsInput";

const defaultTags = [{ parsed: "hello_w0rld", raw: "Hello w0rld" }];

export default function FlashquizForm({ flashquiz, author }) {
  const [tags, setTags] = useState(flashquiz?.tags || defaultTags);
  const [title, setTitle] = useState(flashquiz?.title || "");
  const [body, setBody] = useState(flashquiz?.body || "");
  const [flashcards, setFlashcards] = useState(
    flashquiz?.flashcards || [
      {
        id: (Math.random() + 1).toString(36).substring(7),
        front: "hola",
        back: "mundo",
      },
    ]
  );

  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const router = useRouter();

  function deleteEmptyFlashcards() {
    const items0 = Array.from(flashcards);
    const items1 = items0.filter(
      (item) => item.front.length > 0 && item.back.length > 0
    );
    setFlashcards(items1);
  }

  const createFlashquiz = async () => {
    try {
      setSending(true);
      deleteEmptyFlashcards();
      const res = await fetch("/api/content/create", {
        method: "POST",
        body: JSON.stringify({
          data: { title, body, tags, flashcards },
          type: "flashquiz",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((err) => console.error(err));

      router.push(
        `/@/${res.author.username}/flashquizzes/${res.content.ref.id}/`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateFlashquiz = async () => {
    setSending(true);
    const res = await fetch("/api/content/update", {
      method: "PUT",
      body: JSON.stringify({
        data: { title, body, tags, flashcards },
        ref: flashquiz.ref,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));

    if (res.updated) {
      router.push(`/@/${author.username}/flashquizzes/${flashquiz.ref.id}/`);
    } else {
      console.error("Error updating flashquiz");
    }
  };

  const deleteFlashquiz = async () => {
    try {
      const res = await fetch("/api/content/delete", {
        method: "DELETE",

        body: JSON.stringify({
          ref: flashquiz.ref,
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
        console.error("Error eliminando flashquiz");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = () => {
    if (flashquiz) {
      updateFlashquiz();
    } else {
      createFlashquiz();
    }
  };

  return (
    <div className="rounded-lg px-6 py-2">
      <div className="mb-4">
        <label
          className="mb-1 block text-sm font-bold "
          htmlFor="title"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          defaultValue={title}
          className="w-full rounded border bg-white px-3 py-2 outline-none dark:bg-gray-700"
          placeholder="Las teorías del origen de la vida"
        />
        {error && (
          <p className="font-bold text-red-900">El nombre es obligatorio</p>
        )}
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-bold "
          htmlFor="body"
        >
          Body
        </label>
        <textarea
          type="text"
          id="body"
          onChange={(e) => setBody(e.target.value)}
          defaultValue={body}
          rows="5"
          className="w-full rounded border bg-white px-3 py-2 outline-none dark:bg-gray-700"
          placeholder="¿De qué trata este flashquiz?"
        />
        {error && (
          <p className="font-bold text-red-900">El nombre es obligatorio</p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="mb-1 mt-3 block text-sm font-bold"
          htmlFor="flashcards"
        >
          Flashcards ({flashcards.length}/30)
        </label>
        <FlashcardList
          flashcards={flashcards}
          handleOnFlashcardsChange={setFlashcards}
        />
      </div>

      <TagsInput tags={tags} handleOnTagsChange={setTags} />

      <div className="mt-2 flex space-x-2 text-white ">
        <button
          onClick={handleSubmit}
          className="w-40 rounded bg-gradient-to-r from-sky-500 to-purple-500 py-2 px-4 font-bold hover:from-sky-600 hover:to-purple-600 disabled:from-slate-400 disabled:to-slate-700 hover:disabled:from-slate-500 hover:disabled:to-gray-800"
          disabled={sending}
          type="button"
        >
          {sending ? "Enviando..." : flashquiz ? "Actualizar" : "Crear"}
        </button>

        {flashquiz && (
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
          onDelete={deleteFlashquiz}
        />
      )}
    </div>
  );
}
