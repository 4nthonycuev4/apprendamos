/** @format */
import { Client, query } from "faunadb";

import { CreatePublication } from "./publications/create";
import {
    GetSinglePublication,
    GetTrendingPublications,
    GetHomePublications,
    GetSavedPublications,
    GetAuthorPublications,
} from "./publications/read";
import { DeletePublication } from "./publications/delete";

import { CreateComment } from "./comments/create";
import { GetPublicationComments } from "./comments/read";

import { CreateUser } from "./users/create";
import {
    GetSuggestedUsers,
    GetTrendingUsers,
    GetViewer,
    GetSingleUser,
    GetFollowingStatus,
} from "./users/read";
import { UpdateViewer } from "./users/update";

import LikePublication from "./interactions/publications/like";
import DislikePublication from "./interactions/publications/dislike";
import SavePublication from "./interactions/publications/save";
import FollowAuthor from "./interactions/authors/follow";

import GetPublicationInteractions from "./interactions/publications/read";
import GetAuthorInteractions from "./interactions/authors/read";

import GetPublicationStats from "./stats/publications";
import GetAuthorStats from "./stats/authors";

import GetNotifications from "./notifications/read";

import {
    GetViewerPublicationDrafts,
    GetSinglePublicationDraft,
    CreatePublicationDraft,
    UpdatePublicationDraft,
    PublishPublicationDraft,
} from "./drafts";

import { GetAuthorFollowers, GetAuthorFollowing } from "./authors";

import FaunaToJSON from "./utils/FaunaToJSON";

const {
    Ref,
    Collection,
    Paginate,
    Join,
    Distinct,
    Match,
    Var,
    Get,
    Lambda,
    Index,
    If,
    Equals,
    Select,
    Let,
    Update,
    Delete,
    Union,
    NGram,
    Now,
    Map,
} = query;

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

    // VIEWER CRUD
    async getViewer() {
        return this.client.query(GetViewer()).then((res) => FaunaToJSON(res));
    }

    async updateViewer(data) {
        return this.client
            .query(UpdateViewer(data))
            .then((res) => FaunaToJSON(res))
            .catch((error) => {
                console.log("error", error);
                return null;
            });
    }

    async register(data) {
        return this.client
            .query(CreateUser(data))
            .then((res) => FaunaToJSON(res));
    }

    async getViewerAuthorStats(username) {
        return this.client
            .query(GetViewerAuthorStats(username))
            .then((res) => FaunaToJSON(res));
    }

    // STATS
    async getPublicationStats(id) {
        return this.client
            .query(GetPublicationStats(Ref(Collection("publications"), id)))
            .then((res) => FaunaToJSON(res));
    }

    async getAuthorStats(username) {
        return this.client
            .query(GetAuthorStats(username))
            .then((res) => FaunaToJSON(res));
    }

    // INTERACTIONS
    async getPublicationInteractions(id) {
        return this.client
            .query(
                GetPublicationInteractions(Ref(Collection("publications"), id))
            )
            .then((res) => FaunaToJSON(res));
    }

    async getAuthorInteractions(username) {
        return this.client
            .query(GetAuthorInteractions(username))
            .then((res) => FaunaToJSON(res));
    }

    async likePublication(id) {
        return this.client
            .query(LikePublication(Ref(Collection("publications"), id)))
            .then((res) => FaunaToJSON(res));
    }

    async dislikePublication(id) {
        return this.client
            .query(DislikePublication(Ref(Collection("publications"), id)))
            .then((res) => FaunaToJSON(res));
    }

    async savePublication(id) {
        return this.client
            .query(SavePublication(Ref(Collection("publications"), id)))
            .then((res) => FaunaToJSON(res));
    }

    async followAuthor(username) {
        return this.client
            .query(FollowAuthor(username))
            .then((res) => FaunaToJSON(res));
    }

    // NOTIFICATIONS CRUD
    async getNotifications(afterId) {
        const afterRef = afterId && Ref(Collection("notifications"), afterId);
        return this.client
            .query(GetNotifications(afterRef))
            .then((res) => FaunaToJSON(res));
    }

    //COMMENTS CRUD

    async getPublicationComments(ref, afterId) {
        const afterRef = afterId ? Ref(Collection("comments"), afterId) : null;
        return this.client
            .query(
                GetPublicationComments(
                    Ref(Collection(ref.collection), ref.id),
                    afterRef
                )
            )
            .then((res) => FaunaToJSON(res))
            .catch((error) => {
                console.log("error", error);
                return null;
            });
    }

    async createComment(ref, message, coins) {
        return this.client
            .query(
                CreateComment(Ref(Collection(ref.collection), ref.id), message)
            )
            .then((res) => FaunaToJSON(res))
            .catch((error) => {
                console.log("error", error);
                return null;
            });
    }

    async updateComment(ref, message) {
        return this.client
            .query(
                Update(Ref(Collection(ref.collection), ref.id), {
                    data: { message },
                })
            )
            .then((res) => FaunaToJSON(res))
            .catch((error) => {
                console.log("error", error);
                return null;
            });
    }

    async deleteComment(ref) {
        return this.client
            .query(Delete(Ref(Collection(ref.collection), ref.id)))
            .then((res) => FaunaToJSON(res))
            .catch((error) => {
                console.log("error", error);
                return null;
            });
    }

    // USERS CRUD

    async getSingleUser(username) {
        return this.client
            .query(GetSingleUser(username))
            .then((res) => FaunaToJSON(res));
    }

    async getSuggestedUsers(afterId) {
        const afterRef = afterId ? Ref(Collection("users"), afterId) : null;
        return this.client
            .query(GetSuggestedUsers(afterRef))
            .then((res) => FaunaToJSON(res));
    }

    async getAuthorFollowers(username, afterId) {
        const afterRef = afterId && Ref(Collection("users"), afterId);
        return this.client
            .query(GetAuthorFollowers(username, afterRef))
            .then((res) => FaunaToJSON(res));
    }

    async getAuthorFollowing(username, afterId) {
        const afterRef = afterId && Ref(Collection("users"), afterId);
        return this.client
            .query(GetAuthorFollowing(username, afterRef))
            .then((res) => FaunaToJSON(res));
    }

    async getTrendingUsers(afterId) {
        const afterRef = afterId && Ref(Collection("users"), afterId);
        return this.client
            .query(GetTrendingUsers(afterRef))
            .then((res) => FaunaToJSON(res));
    }

    async getFollowingStatus(username) {
        return this.client
            .query(GetFollowingStatus(username))
            .then((res) => FaunaToJSON(res));
    }

    // SEARCH

    async searchPublications(string) {
        let parsedString = string
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        const match = await this.client
            .query(
                Map(
                    Distinct(NGram(parsedString, 3, 3)),
                    Lambda(
                        "trigram",
                        Select(
                            ["data"],
                            Paginate(
                                Match(
                                    Index("publications_by_trigram"),
                                    Var("trigram")
                                )
                            )
                        )
                    )
                )
            )
            .then((res) => FaunaToJSON(res));

        console.log("match", match);

        let frequency = {},
            value,
            childArray;
        for (let i = 0; i < match.length; i++) {
            childArray = match[i];
            if (childArray && childArray.length) {
                for (let j = 0; j < childArray.length; j++) {
                    value = match[i][j];
                    if (value in frequency) {
                        frequency[value]++;
                    } else {
                        frequency[value] = 1;
                    }
                }
            }
        }

        let uniques = [];
        for (value in frequency) {
            uniques.push(value);
        }

        const ids = uniques.sort((a, b) => frequency[b] - frequency[a]);
        return this.client
            .query(
                Map(
                    ids,
                    Lambda(
                        "id",
                        GetPartialPublication(
                            Ref(Collection("publications"), Var("id"))
                        )
                    )
                )
            )
            .then((res) => FaunaToJSON(res));
    }

    // PUBLICATION DRAFTS CRUD
    async createPublicationDraft(body) {
        return this.client
            .query(CreatePublicationDraft(body))
            .then((res) => FaunaToJSON(res));
    }

    async updatePublicationDraft(id, body) {
        return this.client
            .query(
                UpdatePublicationDraft(
                    Ref(Collection("publications"), id),
                    body
                )
            )
            .then((res) => FaunaToJSON(res));
    }

    async getSinglePublicationDraft(id) {
        return this.client
            .query(
                GetSinglePublicationDraft(Ref(Collection("publications"), id))
            )
            .then((res) => FaunaToJSON(res));
    }

    async getViewerPublicationDrafts(afterId) {
        const afterRef = afterId && Ref(Collection("publications"), afterId);
        return this.client
            .query(GetViewerPublicationDrafts(afterRef))
            .then((res) => FaunaToJSON(res));
    }

    async publishPublicationDraft(id) {
        return this.client
            .query(PublishPublicationDraft(Ref(Collection("publications"), id)))
            .then((res) => FaunaToJSON(res));
    }

    // PUBLICATIONS CRUD

    async getSinglePublication(id) {
        return this.client
            .query(GetSinglePublication(Ref(Collection("publications"), id)))
            .then((res) => FaunaToJSON(res));
    }

    async getSinglePublicationDraft(id) {
        return this.client
            .query(
                GetSinglePublicationDraft(Ref(Collection("publications"), id))
            )
            .then((res) => FaunaToJSON(res));
    }

    async getTrendingPublications(afterId) {
        const afterRef = afterId && Ref(Collection("publications"), afterId);
        return this.client
            .query(GetTrendingPublications(afterRef))
            .then((res) => FaunaToJSON(res));
    }

    async getAuthorPublications(username, afterId) {
        const afterRef = afterId && Ref(Collection("publications"), afterId);
        return this.client
            .query(GetAuthorPublications(username, afterRef))
            .then((res) => FaunaToJSON(res));
    }

    async getHomePublications(afterId) {
        const afterRef = afterId && Ref(Collection("publications"), afterId);
        return this.client
            .query(GetHomePublications(afterRef))
            .then((res) => FaunaToJSON(res));
    }

    async getSavedPublications(afterId) {
        const afterRef =
            afterId && Ref(Collection("publicationinteractions"), afterId);
        return this.client
            .query(GetSavedPublications(afterRef))
            .then((res) => FaunaToJSON(res));
    }

    async updatePublication(id, body, isDraft, isQuestion) {
        return this.client
            .query(
                Let(
                    {
                        publication: Update(
                            Ref(Collection("publications"), id),
                            {
                                data: {
                                    body,
                                    isDraft,
                                    isQuestion,
                                    publishedAt: If(isDraft, null, Now()),
                                },
                            }
                        ),
                    },
                    { id }
                )
            )
            .then((res) => FaunaToJSON(res));
    }

    async deletePublication(ref) {
        return this.client
            .query(DeletePublication(ref))
            .then((res) => FaunaToJSON(res))
            .catch((error) => {
                console.log("error", error);
                return {
                    error: {
                        message: error.message,
                        description: error.description,
                    },
                };
            });
    }
}
