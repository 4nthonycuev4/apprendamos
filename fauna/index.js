/** @format */

import { FaunaToJSON, MDtoHTML, ParseDocType } from "./utils";
import { GetContentComments } from "./comment/read";
import { GetPostWithMinimalAuthorAndComments } from "./post/read";
import { GetViewerContentStats } from "./interactions/read";
import { LikeContent } from "./interactions/create";
import { GetViewer } from "./user/read";

import { Client, query } from "faunadb";
import { CreateComment } from "./comment/create";

const { Ref, Collection } = query;

export default class FaunaClient {
	constructor(secret) {
		if (secret) {
			this.client = new Client({
				secret,
				domain: process.env.FAUNA_DOMAIN,
			});
		} else {
			this.client = new Client({
				secret: process.env.FAUNA_SECRET,
				domain: process.env.FAUNA_DOMAIN,
			});
		}
	}
	async getViewer() {
		return await this.client
			.query(GetViewer())
			.then((res) => {
				const x = FaunaToJSON(res);
				console.log("x", x);
				return x;
			})
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async getSinglePostWithMinimalAuthorAndComments(postId) {
		return await this.client
			.query(
				GetPostWithMinimalAuthorAndComments(Ref(Collection("Posts"), postId))
			)
			.then((res) => {
				const doc = FaunaToJSON(res);
				return { ...doc.post, author: doc.author, comments: doc.comments };
			})
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async getViewerContentStats(ref) {
		const docType = ParseDocType(ref);
		return await this.client
			.query(
				GetViewerContentStats(Ref(Collection(ref.collection), ref.id), docType)
			)
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async likeContent(ref) {
		const docType = ParseDocType(ref);
		return await this.client
			.query(LikeContent(Ref(Collection(ref.collection), ref.id), docType))
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}
	async createComment(ref, message, coins) {
		const docType = ParseDocType(ref);
		return await this.client
			.query(
				CreateComment(
					Ref(Collection(ref.collection), ref.id),
					docType,
					message,
					coins
				)
			)
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}
}
