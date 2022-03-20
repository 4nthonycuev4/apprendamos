/** @format */

export function formatFaunaDoc(doc) {
	let docUpdated = {
		...doc.data,
		id: doc.ref.id,
		ts: doc.ts / 1000,
	};

	if (docUpdated.quiz) docUpdated.quiz = docUpdated.quiz.id;
	return docUpdated;
}

export function formatFaunaDocs(docs) {
	if (!docs?.length || docs?.length === 0) return [];
	return docs.map((doc) => formatFaunaDoc(doc));
}
