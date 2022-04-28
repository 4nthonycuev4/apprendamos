/** @format */

import { GetViewerRef } from "./read";

export function UpdateUser(name, username, about, picture) {
	return Update(GetViewerRef(), {
		data: {
			name,
			username,
			about,
			picture,
		},
	});
}
