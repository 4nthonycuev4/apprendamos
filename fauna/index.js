/** @format */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

import { query, Client } from "faunadb";

const {
	Get,
	Paginate,
	Match,
	Map,
	Index,
	Lambda,
	Var,
	Function: F,
	Call,
	Ref,
	Collection,
	Let,
	Select,
	Join,
	If,
	Equals,
	Create,
	Now,
	Update,
} = query;

export default class FaunaClient {
	constructor(secret, viewer, accountConnection) {
		if (secret) {
			this.client = new Client({
				secret,
				domain: process.env.FAUNA_DOMAIN,
			});

			if (viewer) {
				this.viewerRef = Ref(Collection("Users"), viewer.ref.id);
				this.viewer = viewer;
			}

			if (accountConnection) {
				this.accountConnection = accountConnection;
			}
		} else {
			this.client = new Client({
				secret: process.env.FAUNA_SECRET,
				domain: process.env.FAUNA_DOMAIN,
			});
		}
	}

	#formatFaunaRef(ref) {
		return {
			collection: ref.collection.id,
			id: ref.id,
		};
	}

	#formatFaunaDoc(res) {
		if (res.author) {
			return {
				...this.#formatFaunaDoc(res[Object.keys(res)[0]]),
				author: this.#formatFaunaDoc(res.author),
			};
		}

		let docFormatted = {
			...res.data,
			ref: this.#formatFaunaRef(res.ref),
			ts: res.ts / 1000,
		};

		Object.keys(docFormatted).map((key) => {
			if (key.includes("Ref"))
				docFormatted[key] = this.#formatFaunaRef(docFormatted[key]);
		});

		if (docFormatted.created) docFormatted.created = docFormatted.created.value;
		if (docFormatted.joined) docFormatted.joined = docFormatted.joined.value;

		if (docFormatted.coins) delete docFormatted.coins;

		return docFormatted;
	}

	#formatFaunaDocs(docs) {
		if (!docs?.length || docs?.length === 0) return [];
		return docs.map((res) => this.#formatFaunaDoc(res));
	}

	#getFlashquiz(flashquizRef, withAuthor = false) {
		if (withAuthor) {
			return Let(
				{
					flashquiz: Get(flashquizRef),
					author: Get(Select(["data", "authorRef"], Var("flashquiz"))),
				},
				{
					flashquiz: Var("flashquiz"),
					author: Var("author"),
				}
			);
		}
		return Get(flashquizRef);
	}

	#getPost(postRef, withAuthor = false) {
		if (withAuthor) {
			return Let(
				{
					post: Get(postRef),
					author: Get(Select(["data", "authorRef"], Var("post"))),
				},
				{
					post: Var("post"),
					author: Var("author"),
				}
			);
		}
		return Get(postRef);
	}

	#getAllContent() {
		return Map(
			Paginate(Join(Match(Index("all_content")), Index("content_sorted_ts"))),
			Lambda(
				["ts", "ref"],
				If(
					Equals("Flashquizzes", Select(["collection", "id"], Var("ref"))),
					this.#getFlashquiz(Var("ref"), true),
					this.#getPost(Var("ref"), true)
				)
			)
		);
	}

	#getUserContent(authorRef) {
		return Map(
			Paginate(
				Join(
					Match(Index("content_by_authorRef"), authorRef),
					Index("content_sorted_ts")
				)
			),
			Lambda(
				["ts", "ref"],
				If(
					Equals("Flashquizzes", Select(["collection", "id"], Var("ref"))),
					this.#getFlashquiz(Var("ref"), true),
					this.#getPost(Var("ref"), true)
				)
			)
		);
	}

	async getFlashquiz(id) {
		const flashquiz = await this.client
			.query(this.#getFlashquiz(Ref(Collection("Flashquizzes"), id), true))
			.then((res) => this.#formatFaunaDoc(res))
			.catch((error) => {
				console.error(error);
				return null;
			});

		return flashquiz;
	}

	async getPost(id) {
		const post = await this.client
			.query(this.#getPost(Ref(Collection("Posts"), id), true))
			.then((res) => this.#formatFaunaDoc(res))
			.catch((error) => {
				console.error(error);
				return null;
			});

		return post;
	}

	async createComment(ref, message, coins) {
		const documentType = ref.collection.includes("Flashquiz")
			? "Flashquiz"
			: ref.collection.slice(0, -1);

		const comment = await this.client
			.query(
				Create(Collection(`Comments${documentType}`), {
					data: {
						message,
						coins,
						authorRef: this.viewerRef,
						[`${documentType.toLowerCase()}Ref`]: Ref(
							Collection(ref.collection),
							ref.id
						),
						created: Now(),
					},
				})
			)
			.then((res) => this.#formatFaunaDoc(res))
			.catch((error) => {
				console.error(error);
				return null;
			});

		return comment;
	}

	async getComments(ref) {
		const documentType = ref.collection.includes("Flashquiz")
			? "Flashquiz"
			: ref.collection.slice(0, -1);

		const comments = await this.client
			.query(
				Map(
					Paginate(
						Join(
							Match(
								Index(`comments_by_${documentType.toLowerCase()}Ref`),
								Ref(Collection(ref.collection), ref.id)
							),
							Index("content_sorted_ts")
						)
					),
					Lambda(
						["ts", "ref"],
						Let(
							{
								comment: Get(Var("ref")),
								author: Get(Select(["data", "authorRef"], Var("comment"))),
							},
							{ comment: Var("comment"), author: Var("author") }
						)
					)
				)
			)
			.then((res) => this.#formatFaunaDocs(res.data))
			.catch((error) => {
				console.error(error);
				return null;
			});

		return comments;
	}

	async createPost(body, tags) {
		if (!/^[A-Za-z0-9,_-]*$/.test(tags)) {
			return null;
		}
		const parsedtags = tags.split(",");
		const html = await unified()
			.use(remarkParse)
			.use(remarkMath)
			.use(remarkGfm)
			.use(remarkRehype)
			.use(rehypeKatex)
			.use(rehypeStringify)
			.process(body);
		const post = await this.client
			.query(
				Create(Collection("Posts"), {
					data: {
						body: String(html),
						bodyMd: body,
						authorRef: this.viewerRef,
						tags: parsedtags,
						created: Now(),
						stats: {
							likes: 0,
							saved: 0,
							comments: 0,
						},
					},
				})
			)
			.then((res) => {
				let post = this.#formatFaunaDoc(res);
				post.author = { username: this.viewer.username };
				return post;
			})
			.catch((error) => {
				console.error(error);
				return null;
			});

		return post;
	}

	async updatePost(id, body, tags) {
		if (!/^[A-Za-z0-9,_-]*$/.test(tags)) {
			return null;
		}
		const parsedtags = tags.split(",");
		const html = await unified()
			.use(remarkParse)
			.use(remarkMath)
			.use(remarkGfm)
			.use(remarkRehype)
			.use(rehypeKatex)
			.use(rehypeStringify)
			.process(body);
		const post = await this.client
			.query(
				Update(Ref(Collection("Posts"), id), {
					data: {
						body: String(html),
						bodyMd: body,
						tags: parsedtags,
					},
				})
			)
			.then((res) => {
				let post = this.#formatFaunaDoc(res);
				post.author = { username: this.viewer.username };
				return post;
			})
			.catch((error) => {
				console.error(error);
				return null;
			});

		return post;
	}

	async createFlashquiz(name, tags, flashcards) {
		if (!/^[A-Za-z0-9,_-]*$/.test(tags)) {
			return null;
		}
		const parsedtags = tags.split(",");

		const flashquiz = await this.client
			.query(
				Create(Collection("Flashquizzes"), {
					data: {
						name,
						tags: parsedtags,
						flashcards,
						authorRef: this.viewerRef,
						created: Now(),
						stats: {
							likes: 0,
							saved: 0,
							comments: 0,
						},
					},
				})
			)
			.then((res) => {
				let flashquiz = this.#formatFaunaDoc(res);
				flashquiz.author = { username: this.viewer.username };
				return flashquiz;
			})
			.catch((error) => {
				console.error(error);
				return null;
			});

		return flashquiz;
	}

	async updateFlashquiz(id, name, tags, flashcards) {
		if (!/^[A-Za-z0-9,_-]*$/.test(tags)) {
			return null;
		}
		const parsedtags = tags.split(",");

		const flashquiz = await this.client
			.query(
				Update(Ref(Collection("Flashquizzes"), id), {
					data: {
						name,
						tags: parsedtags,
						flashcards,
					},
				})
			)
			.then((res) => {
				let flashquiz = this.#formatFaunaDoc(res);
				flashquiz.author = { username: this.viewer.username };
				return flashquiz;
			})
			.catch((error) => {
				console.error(error);
				return null;
			});

		return flashquiz;
	}

	async createUser(name, about, username, picture) {
		const user = await this.client
			.query(
				Let(
					{
						user: Create(Collection("Users"), {
							data: {
								name,
								username,
								about,
								picture,
								joined: Now(),
								stats: {
									received: { likes: 0, saved: 0, comments: 0 },
									given: { likes: 0, saved: 0, comments: 0 },
									followers: 0,
									following: 0,
									posts: 0,
									flashquizzes: 0,
									questions: 0,
									answers: 0,
									coins: 0,
								},
							},
						}),
						account: Create(Collection("Accounts"), {
							data: {
								connection: this.accountConnection,
								userRef: Select(["ref"], Var("user")),
							},
						}),
					},
					{ user: Var("user"), account: Var("account") }
				)
			)
			.then((res) => this.#formatFaunaDoc(res))
			.catch((error) => {
				console.error(error);
				return null;
			});

		return user;
	}

	async updateUser(name, about, username, picture) {
		const user = await this.client
			.query(
				Update(this.viewerRef, {
					data: {
						name,
						username,
						about,
						picture,
					},
				})
			)
			.then((res) => this.#formatFaunaDoc(res))
			.catch((error) => {
				console.error(error);
				return null;
			});

		return user;
	}

	async getUserWithContent(username) {
		const user = await this.client
			.query(
				Let(
					{
						user: Call(F("getUserByUsername"), username),
						content: this.#getUserContent(Select(["ref"], Var("user"))),
					},
					{ user: Var("user"), content: Var("content") }
				)
			)
			.then((res) => {
				let user = this.#formatFaunaDoc(res.user);
				user.content = this.#formatFaunaDocs(res.content.data);
				return user;
			})
			.catch((error) => {
				console.error(error);
				return null;
			});
		return user;
	}

	async getViewer() {
		const viewer = await this.client
			.query(
				Get(Call(F("getUserRefByAccountConnection"), this.accountConnection))
			)
			.then((res) => this.#formatFaunaDoc(res))
			.catch((error) => {
				console.error(error);
				return null;
			});
		return viewer;
	}

	async getContent() {
		const content = await this.client
			.query(this.#getAllContent())
			.then((res) => this.#formatFaunaDocs(res.data))
			.catch((error) => {
				console.error(error);
				return null;
			});
		return content;
	}
}
