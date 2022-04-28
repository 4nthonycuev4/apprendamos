/** @format */

export function UpdateFlashquiz(flashquizRef, name, tags, flashcards) {
	Update(flashquizRef, {
		data: {
			name,
			tags,
			flashcards,
			updated: true,
		},
	});
}
