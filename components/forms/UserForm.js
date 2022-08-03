/** @format */

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/router";

export default function UserForm({ user }) {
    const [selectedPictureId, setSelectedPictureId] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: user?.name,
            nickname: user?.nickname,
            about: user?.about,
        },
    });

    const router = useRouter();
    const picture = `/ru${selectedPictureId}.jpg`;
    const createUser = async (data) => {
        const { name, about, nickname } = data;
        try {
            await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ name, about, nickname, picture }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            router.push("/signup/step-3");
        } catch (err) {
            console.error(err);
        }
    };

    const updateUser = async (data) => {
        const { name, about, nickname } = data;
        try {
            const user = await fetch(`/api/viewer/update`, {
                method: "PUT",
                body: JSON.stringify({ name, about, nickname, picture }),
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
            onSubmit={handleSubmit(user?.faunaRef ? updateUser : createUser)}
            className="max-w-xl justify-center"
        >
            <div className="">
                <label
                    className="mb-1 block text-sm font-bold"
                    htmlFor="picture"
                >
                    Foto de perfil
                </label>
                <div className="flex w-full items-center justify-between">
                    <div className="relative rounded-full border w-32 h-32 overflow-hidden">
                        <Image
                            src={`/ru${selectedPictureId}.jpg`}
                            alt="User picture"
                            layout="fill"
                            objectFit="fill"
                            quality={20}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {[...Array(8).keys()].map((i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedPictureId(i)}
                                className={
                                    "cursor-pointer relative rounded-full w-20 h-20 overflow-hidden border-2 " +
                                    (selectedPictureId === i &&
                                        "border-blue-700")
                                }
                            >
                                <Image
                                    src={`/ru${i}.jpg`}
                                    alt="User picture"
                                    layout="fill"
                                    objectFit="fill"
                                    quality={10}
                                />
                            </div>
                        ))}
                    </div>
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
                    <p className="font-bold text-red-900">
                        El nombre es obligatorio
                    </p>
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
                    className="w-full resize-none rounded-lg border px-3 py-2 text-gray-700 "
                    placeholder="Cuéntanos sobre ti"
                />
                {errors.bio && (
                    <p className="font-bold text-red-900">
                        La bio es obligatoria
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label
                    className="mb-1  block text-sm font-bold"
                    htmlFor="nickname"
                >
                    Nombre de Usuario
                </label>
                <input
                    type="text"
                    id="nickname"
                    {...register("nickname", {
                        required: true,
                        minLength: 4,
                        maxLength: 20,
                        pattern: /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/,
                    })}
                    className="w-full rounded border bg-white px-3 py-2 text-gray-700 outline-none"
                />
                {errors.nickname && (
                    <p className="font-bold text-red-900">
                        {errors.nickname.type === "required" &&
                            "El nombre de usuario es obligatorio"}
                        {errors.nickname.type === "minLength" &&
                            "El nombre de usuario debe tener al menos 4 caracteres"}
                        {errors.nickname.type === "maxLength" &&
                            "El nombre de usuario no puede tener más de 20 caracteres"}
                        {errors.nickname.type === "pattern" &&
                            "El nombre de usuario solo puede contener (letras y números) y (guiones y puntos) entre ellos"}
                    </p>
                )}
            </div>

            <div className="text-right">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="border-2 border-blue-700 text-blue-700 rounded px-2 py-1 mr-4 font-semibold"
                >
                    Atrás
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="border-2 border-blue-700 bg-blue-700 rounded px-2 py-1 text-gray-100 font-semibold"
                >
                    {user?.faunaRef ? "Actualizar" : "Continuar"}
                </button>
            </div>
        </form>
    );
}
