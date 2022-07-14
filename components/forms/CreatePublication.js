/** @format */
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { PublicationForm } from "../Markdown";

export default function CreatePublicationForm({ user }) {
  const [body, setBody] = useState("# Hello world!");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { draftId } = router.query;

  const createDraft = async () => {
    try {
      setSaving(true);
      const { id } = await fetch(`/api/publications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body,
        })
      }).then(res => res.json());

      router.push(`/draft?draftId=${id}`, undefined, { shallow: true });
      setSaved(true);
      setSaving(false);
    } catch (error) {
      console.log(error);
    }
  }

  const saveDraft = async () => {
    try {
      setSaving(true);
      const { id } = await fetch(`/api/publications/${draftId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body,
          isDraft: true,
        })
      }).then(res => res.json());
      setSaved(true);
      setSaving(false);
    } catch (error) {
      console.log(error);
    }
  }

  const publish = async () => {
    try {
      setSaving(true);
      await fetch(`/api/publications/${draftId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body,
          isDraft: false,
          isQuestion: true,
        })
      }).then(res => res.json());
      setSaved(true);
      setSaving(false);
      router.push("/publications/[id]", `/publications/${draftId}`);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (draftId) {
      await saveDraft();
    } else {
      await createDraft();
    }
  }

  return (
    <>
      <div className="flex w-full justify-between items-center">
        <div className="flex space-x-4 items-center">
          <div className="relative h-8 w-8">
            <Image
              src={user.picture}
              alt="Picture of the author"
              layout="fill"
              objectFit="fill"
              className="rounded-full"
            />
          </div>
          <span className="text-gray-200">Borrador de {user.username}</span>
          <span className="text-gray-400">{saved ? "Guardado" : saving ? "Guardando..." : ""}</span>
        </div>
        <div className="flex space-x-4 items-center">
          <button type="button" className="bg-red-400 text-gray-100 font-bold px-1 rounded">Descartar</button>
          {
            saved ?
              <button type="button" className="w-40 bg-green-400 text-gray-100 font-bold px-1 rounded" onClick={publish}>Publicar</button>
              :
              <button type="submit" className="w-40 bg-green-400 text-gray-100 font-bold px-1 rounded" onClick={handleSubmit}>Guardar borrador</button>
          }
        </div>
      </div>
      <br></br>
      <div className="w-full">
        <PublicationForm content={body} setContent={setBody} setSaved={setSaved} />
      </div>
    </>
  );
}