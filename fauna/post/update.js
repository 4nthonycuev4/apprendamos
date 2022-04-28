/** @format */

export function UpdatePost(postRef, body, tags) {
	Update(postRef, {
		data: {
			body,
			tags,
			updated: true,
		},
	});
}
