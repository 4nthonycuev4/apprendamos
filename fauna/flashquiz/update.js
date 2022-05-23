/** @format */

export function Updatememorama(memoramaRef, name, tags, flashcards) {
  Update(memoramaRef, {
    data: {
      name,
      tags,
      flashcards,
      updated: true,
    },
  });
}
