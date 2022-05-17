/** @format */

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";

function DeleteTimedown({ onCancel, onDelete }) {
  const [time, setTime] = useState(5000);
  const [timerOn, setTimerOn] = useState(true);

  useEffect(() => {
    let interval = null;

    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1000);
      }, 1000);
    } else if (!timerOn) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  useEffect(() => {
    if (time <= 0) {
      setTimerOn(false);
      onDelete();
    }
  }, [time, onDelete]);

  return (
    <div className="text-center">
      <h1 className="mb-4 text-3xl font-bold">
        {timerOn ? Math.floor(time / 1000) : "Eliminando..."}
      </h1>

      {timerOn && (
        <div className="space-x-2 text-white">
          <button
            type="button"
            onClick={onCancel}
            className="w-40 rounded bg-gradient-to-r from-slate-400 to-slate-700  py-2 px-4 font-bold hover:from-slate-500 hover:to-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              setTimerOn(false);
              onDelete();
            }}
            className="w-40 rounded bg-gradient-to-r from-pink-500 to-red-500  py-2 px-4 font-bold hover:from-pink-600 hover:to-red-600"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default function DeleteModal({ onClose = () => {}, onDelete }) {
  const overlayRef = useRef();

  return (
    <Dialog
      static
      open
      onClose={onClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-20 flex items-center justify-center"
    >
      <Dialog.Overlay ref={overlayRef} className="fixed inset-0 bg-white" />
      <div className="relative flex h-full w-full items-center justify-center">
        <DeleteTimedown onCancel={onClose} onDelete={onDelete} />
      </div>
    </Dialog>
  );
}
