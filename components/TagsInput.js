/** @format */
import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/solid";

export default function TagsInput({ tags, handleOnTagsChange }) {
  const [error, setError] = useState(null);

  const [taglist, setTagList] = useState(tags);

  const update = (items) => {
    setTagList(items);
    handleOnTagsChange(items);
  };

  const handleDelete = (i) => {
    const items = Array.from(taglist);
    items.splice(i, 1);
    update(items);
  };

  const handleAdd = (tag) => {
    const newTagList = taglist.concat(tag);
    update(newTagList);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  return (
    <div className="">
      <label className="text-sm font-bold">Tags</label>
      <div className="flex flex-wrap gap-2">
        {tags &&
          tags.length > 0 &&
          tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center rounded-md bg-sky-800 px-4 py-1 text-xs font-semibold text-sky-300"
            >
              <span>{tag.raw}</span>
              <button type="button" onClick={() => handleDelete(index)}>
                <XCircleIcon className="ml-1 h-4 w-4" />
              </button>
            </div>
          ))}
      </div>
      {taglist.length < 8 && (
        <input
          type="text"
          className="mt-2 rounded-md border dark:bg-gray-700"
          placeholder={
            taglist.length >= 8 ? "Alcanzaste el máximo" : "Escribe un tag..."
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const newTag = {
                raw: e.target.value,
                parsed: e.target.value
                  .trim()
                  .toLowerCase()
                  .replaceAll(" ", "_"),
              };

              if (newTag.parsed.length < 3) {
                setError("El tag debe al menos 3 caracteres.");
              } else if (newTag.parsed.length > 16) {
                setError("El tag debe a lo mucho 16 caracteres.");
              } else if (!/^[A-Za-z0-9_-]*$/.test(newTag.parsed)) {
                setError(
                  "Caracteres inválidos. Solo se permiten letras, números, guiones y espacios."
                );
              } else if (taglist.find((tag) => tag.parsed === newTag.parsed)) {
                setError("El tag ya existe.");
              } else {
                setError(null);
                handleAdd(newTag);
                e.target.value = "";
              }
            }
          }}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
