/** @format */

import Flashquiz from "../items/Flashquiz";
import Post from "../items/Post";

export default function Content({ content, author }) {
	if (content.length < 1) {
		return <h1>Sin contenido</h1>;
	}
	if (author) {
		return (
			<div className='space-y-4'>
				{content.map((x) => {
					if (x.ref.collection === "Flashquizzes")
						return (
							<Flashquiz key={x.ref.id} flashquiz={{ ...x, author: author }} />
						);
					if (x.ref.collection === "Posts")
						return (
							<Post
								key={x.ref.id}
								post={{ ...x, author: author }}
								preview={true}
							/>
						);
				})}
			</div>
		);
	}
	return (
		<div className='space-y-4'>
			{content.map((x) => {
				if (x.ref.collection === "Flashquizzes")
					return <Flashquiz key={x.ref.id} flashquiz={x} />;
				if (x.ref.collection === "Posts")
					return <Post post={x} key={x.ref.id} preview={true} />;
			})}
		</div>
	);
}
