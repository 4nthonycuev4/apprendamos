/** @format */
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router";

export default function EditCard({ card, quizId }) {
    const [frontLength, setFrontLength] = useState(card?.front.length || 0);
    const [backLength, setBackLength] = useState(card?.back.length || 0);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm({
        defaultValues: {
            front: card?.front,
            back: card?.back,
        },
    });

    const router = useRouter();

    const createCard = async ({ front, back }) => {
        await fetch("/api/cards/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ front, back, quizId }),
        })
            .then((res) => res.json())
            .then(() => {
                router.push(`/q/${quizId}`);
            })
            .catch(console.error);
        await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    const editCard = async ({ front, back }) => {
        await fetch(`/api/cards/${card.id}/edit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ front, back }),
        })
            .then((res) => res.json())
            .then(() => {
                router.push(`/q/${card.quiz}`);
            })
            .catch(console.error);
        await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    const deleteCard = async () => {
        await fetch(`/api/cards/${card.id}/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then(() => {
                router.push(`/q/${card.quiz}`);
            })
            .catch(console.error);
        await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    return (
        <form onSubmit={handleSubmit(card ? editCard : createCard)}>
            <div className="px-4 ">
                <h1>Editar Carta</h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <textarea
                            {...register("front", {
                                required: true,
                                maxLength: 240,
                            })}
                            rows={10}
                            onChange={(e) =>
                                setFrontLength(e.target.value.length)
                            }
                            className="w-full resize-none rounded-md bg-red-200 p-4 text-center caret-red-500 outline-red-500 "
                        />
                        <h1
                            className={
                                frontLength > 240 || frontLength === 0
                                    ? "text-red-600"
                                    : ""
                            }
                        >
                            <span>Caracteres: </span>
                            <span>{frontLength}</span>
                            <span>/240</span>
                        </h1>
                        {errors.front?.type === "required" && (
                            <p className="text-red-600">
                                Este campo es requerido.
                            </p>
                        )}
                        {errors.front?.type === "maxLength" && (
                            <p className="text-red-600">
                                Superaste el límite de caracteres.
                            </p>
                        )}
                    </div>
                    <div>
                        <textarea
                            {...register("back", {
                                required: true,
                                maxLength: 240,
                            })}
                            rows={10}
                            onChange={(e) =>
                                setBackLength(e.target.value.length)
                            }
                            className="w-full resize-none rounded-md bg-blue-200 p-4 text-center font-bold caret-blue-500 outline-blue-500"
                        />
                        <h1
                            className={
                                backLength > 240 || backLength === 0
                                    ? "text-red-600"
                                    : ""
                            }
                        >
                            <span>Caracteres: </span>
                            <span>{backLength}</span>
                            <span>/240</span>
                        </h1>
                        {errors.back?.type === "required" && (
                            <p className="text-red-600">
                                Este campo es requerido.
                            </p>
                        )}
                        {errors.back?.type === "maxLength" && (
                            <p className="text-red-600">
                                Superaste el límite de caracteres.
                            </p>
                        )}
                    </div>
                </div>
                <Link href={card ? `/q/${card.quiz}` : `/q/${quizId}`}>
                    <a className="focus:shadow-outline mt-3 mr-2 inline-block rounded bg-gray-700 py-2 px-4 font-bold text-white hover:bg-gray-800 focus:outline-none">
                        Cancelar
                    </a>
                </Link>

                {card ? (
                    <button
                        disabled={isSubmitting}
                        className="focus:shadow-outline mr-2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-800 focus:outline-none disabled:bg-gray-200"
                        type="submit"
                    >
                        Editar
                    </button>
                ) : (
                    <button
                        disabled={isSubmitting}
                        className="focus:shadow-outline mr-2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-800 focus:outline-none disabled:bg-gray-200"
                        type="submit"
                    >
                        Crear
                    </button>
                )}
                {card && (
                    <button
                        type="button"
                        onClick={() => deleteCard()}
                        className="focus:shadow-outline mr-2 rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-800 focus:outline-none disabled:bg-gray-200"
                    >
                        Eliminar
                    </button>
                )}
            </div>
        </form>
    );
}
