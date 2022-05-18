/** @format */

import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  FilterIcon,
  HandIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/solid";

export default function FlashcardList({
  flashcards,
  handleOnFlashcardsChange,
}) {
  const [flashcardList, setFlashcardList] = useState(flashcards);

  const updateFlashcardList = (items) => {
    setFlashcardList(items);
    handleOnFlashcardsChange(items);
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(flashcardList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateFlashcardList(items);
  }

  function handleDeleteItem(index) {
    const items = Array.from(flashcardList);
    items.splice(index, 1);
    updateFlashcardList(items);
  }

  function handleAddItem() {
    const items = Array.from(flashcardList);
    items.push({
      id: (Math.random() + 1).toString(36).substring(7),
      front: "",
      back: "",
    });
    updateFlashcardList(items);
  }

  function handleUpdateFlashcard(id, key, value) {
    const items = Array.from(flashcardList);
    const item = items.find((item) => item.id === id);
    item[key] = value;
    updateFlashcardList(items);
  }

  function handleDeleteEmptyItems() {
    const items0 = Array.from(flashcardList);
    const items1 = items0.filter(
      (item) => item.front.length > 0 && item.back.length > 0
    );
    updateFlashcardList(items1);
  }

  return (
    <div>
      <div className="flex space-x-2">
        <button
          disabled={flashcards.length > 30}
          type="button"
          onClick={() => {
            handleAddItem();
          }}
          className="mb-2 flex items-center space-x-1 rounded-md bg-red-400 p-1 text-gray-600 disabled:bg-red-100"
        >
          <h1 className="text-sm">Añadir</h1>
          <PlusCircleIcon className="w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            handleDeleteEmptyItems();
          }}
          className="mb-2 flex items-center space-x-1 rounded-md bg-green-400 p-1 text-gray-600"
        >
          <h1 className="text-sm">Quitar vacíos</h1>
          <FilterIcon className="w-4" />
        </button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="flashcards">
          {(provided) => (
            <ul
              className="space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {flashcardList.map(({ id, front, back }, index) => {
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="flex items-center space-x-2">
                          <button type="button">
                            <HandIcon className="w-5 text-gray-500" />
                          </button>
                          <div className="grid w-full grid-cols-2 gap-2">
                            <input
                              className="h-12 rounded-md p-2 dark:bg-gray-700"
                              type="text"
                              defaultValue={front}
                              placeholder="Front"
                              onChange={(e) => {
                                handleUpdateFlashcard(
                                  id,
                                  "front",
                                  e.target.value
                                );
                              }}
                            />
                            <input
                              className="h-12 rounded-md  p-2 dark:bg-gray-700"
                              type="text"
                              defaultValue={back}
                              placeholder="Back"
                              onChange={(e) => {
                                handleUpdateFlashcard(
                                  id,
                                  "back",
                                  e.target.value
                                );
                              }}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteItem(index)}
                          >
                            <TrashIcon className="w-5 text-gray-500" />
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
