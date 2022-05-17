/** @format */

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/router";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function UserForm({ user }) {
  const hiddenFileInput = useRef(null);
  const [picture, setPicture] = useState(
    user?.ref ? user.picture : `/ru${getRandomInt(1, 8)}.jpg`
  );

  const handleUploadButtonClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleImageUpload = async (x) => {
    const { files } = x.target;
    const file = files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uploads");

      const data = await fetch(
        "https://api.cloudinary.com/v1_1/cardsmemo/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());
      setPicture(data.secure_url);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name,
      username: user?.username,
      about: user?.about,
    },
  });

  const router = useRouter();

  const createUser = async (data) => {
    const { name, about, username } = data;
    try {
      await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ name, about, username, picture }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/api/auth/login");
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async (data) => {
    const { name, about, username } = data;
    try {
      const user = await fetch(`/api/viewer/update`, {
        method: "PUT",
        body: JSON.stringify({ name, about, username, picture }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((err) => console.error(err));

      if (user) return router.push("/api/auth/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(user?.ref ? updateUser : createUser)}
      className="w-full px-4 py-2"
    >
      <div className="flex w-full">
        <div className="w-full">
          <label className="mb-1 block text-sm font-bold" htmlFor="picture">
            Foto de perfil
          </label>
          <div className="flex w-full items-center justify-between">
            <Image
              src={picture}
              alt="User picture"
              width={150}
              height={150}
              className="rounded-full"
            />
            <div className="space-y-2">
              <button
                type="button"
                className="block w-40 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-100"
                onClick={() => setPicture(`/ru${getRandomInt(1, 8)}.jpg`)}
              >
                Avatar aleatorio
              </button>
              <button
                type="button"
                className="block w-40 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
                onClick={() =>
                  setPicture(
                    user?.ref ? user.picture : `/ru${getRandomInt(1, 8)}.jpg`
                  )
                }
              >
                Imagen actual
              </button>
              <button
                onClick={handleUploadButtonClick}
                type="button"
                className="block w-40 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
              >
                Subir foto
              </button>
            </div>
          </div>
          <label className="block">
            <input
              onChange={(e) => handleImageUpload(e)}
              type="file"
              ref={hiddenFileInput}
              name="picture"
              className="hidden"
            />
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label className="mb-1  block text-sm font-bold" htmlFor="name">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: true })}
          className="w-full rounded border bg-white px-3 py-2 text-gray-700 outline-none"
        />
        {errors.title && (
          <p className="font-bold text-red-900">El nombre es obligatorio</p>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-bold" htmlFor="about">
          Acerca de ti...
        </label>
        <textarea
          {...register("about", { required: true })}
          id="about"
          rows="4"
          className="w-full resize-none rounded-lg border px-3 py-2 text-gray-700 focus:outline-none"
          placeholder="Cuéntanos sobre ti"
        />
        {errors.bio && (
          <p className="font-bold text-red-900">La bio es obligatoria</p>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-1  block text-sm font-bold" htmlFor="username">
          Nombre de Usuario
        </label>
        <input
          type="text"
          id="username"
          {...register("username", { required: true })}
          className="w-full rounded border bg-white px-3 py-2 text-gray-700 outline-none"
        />
        {errors.username && (
          <p className="font-bold text-red-900">
            El nombre de usuario es obligatorio
          </p>
        )}
      </div>

      <div className="flex">
        <button
          onClick={() => router.back()}
          className="focus:shadow-outline mr-2 rounded bg-slate-500 py-2 px-4 font-bold text-white hover:bg-slate-700 focus:outline-none"
          type="button"
        >
          Atrás
        </button>
        <button
          disabled={isSubmitting}
          className="focus:shadow-outline mr-2 rounded bg-red-800 py-2 px-4 font-bold text-white hover:bg-red-900 focus:outline-none"
          type="submit"
        >
          {user?.ref ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
