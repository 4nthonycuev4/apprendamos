/** @format */

import { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";

import Card from "./Card";

export default function CardView({ cards }) {
  const [viewing, setViewing] = useState(0);

  const [selected, setSelected] = useState(false);

  if (!cards || !cards.length) {
    return <div>Sin cartas :(</div>;
  }

  return (
    <div className="px-4">
      <button
        type="button"
        className="w-full"
        onClick={() => {
          setSelected(!selected);
        }}
      >
        <Card card={cards[viewing]} selected={selected} />
      </button>
      <div className="flex justify-center">
        <button
          type="button"
          disabled={viewing === cards.length - 1}
          onClick={() => {
            setViewing(viewing + 1);
            setSelected(false);
          }}
          className="disabled:text-gray-300"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
        <span className="mx-5 font-bold">{`${viewing + 1}/${
          cards.length
        }`}</span>
        <button
          type="button"
          disabled={viewing === 0}
          onClick={() => {
            setViewing(viewing - 1);
            setSelected(false);
          }}
          className="disabled:text-gray-300"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
