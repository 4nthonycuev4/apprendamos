/** @format */
import { Client, query } from "faunadb";

import { CreatePublication } from "./publications/create";
import { GetPartialPublication, GetPublicationStats, GetTrendingPublications, GetPublications, GetUserPublications, GetSinglePublication } from "./publications/read";
import { Like, Dislike, Save, View } from './publications/update';
import { DeletePublication } from "./publications/delete";

import { CreateComment } from "./comments/create";
import { GetPublicationComments } from "./comments/read";

import { CreateUser } from "./users/create";
import { GetPartialUser, GetSuggestedUsers, GetTrendingUsers, GetViewer, GetSingleUser, GetFollowers, GetFollowingStatus } from './users/read';
import { UpdateViewer, FollowUser } from "./users/update";

import { GetPublicationInteractions } from "./interactions/read";

import { LikePublication } from "./interactions/likePublication";
import { DislikePublication } from './interactions/dislikePublication';
import { SavePublication } from './interactions/savePublication';

import { GetNotifications } from "./notifications/read";

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
  Map
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
    return this.client
      .query(GetViewer())
      .then((res) => FaunaToJSON(res))
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
      .then((res) => FaunaToJSON(res))
  }

  async getViewerAuthorStats(username) {
    return this.client
      .query(GetViewerAuthorStats(username))
      .then((res) => FaunaToJSON(res));
  }

  // INTERACTIONS CRUD

  async follow(username) {
    return this.client
      .query(FollowUser(username))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async getViewerPublicationStats(ref) {
    const docType = ParseDocType(ref);
    return this.client
      .query(
        GetViewerPublicationStats(Ref(Collection(ref.collection), ref.id), docType)
      )
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async likePublication(id) {
    return this.client
      .query(LikePublication(Ref(Collection("publications"), id)))
      .then((res) => FaunaToJSON(res))
  }

  async dislikePublication(id) {
    return this.client
      .query(DislikePublication(Ref(Collection("publications"), id)))
      .then((res) => FaunaToJSON(res))
  }

  async savePublication(id) {
    return this.client
      .query(SavePublication(Ref(Collection("publications"), id)))
      .then((res) => FaunaToJSON(res))
  }


  // NOTIFICATIONS CRUD
  async getNotifications(afterId) {
    const afterRef = afterId && Ref(Collection("publications"), afterId);
    return this.client
      .query(GetNotifications(afterRef))
      .then((res) => FaunaToJSON(res))
  }

  //COMMENTS CRUD

  async getPublicationComments(ref, afterId) {
    const afterRef = afterId ? Ref(Collection("comments"), afterId) : null;
    return this.client
      .query(GetPublicationComments(Ref(Collection(ref.collection), ref.id), afterRef))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async createComment(ref, message, coins) {
    return this.client
      .query(
        CreateComment(
          Ref(Collection(ref.collection), ref.id),
          message
        )
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
        Update(Ref(Collection(ref.collection), ref.id), { data: { message } })
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
      .then((res) => FaunaToJSON(res))
  }

  async getSuggestedUsers(afterId) {
    const afterRef = afterId ? Ref(Collection("users"), afterId) : null;
    return this.client.query(GetSuggestedUsers(afterRef))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
      });
  }

  async getFollowers(username, after) {
    const afterRef = after && Ref(Collection("users"), after);
    return this.client.query(GetFollowers(username, afterRef))
      .then((res) => FaunaToJSON(res))
  }

  async getTrendingUsers(afterId) {
    const afterRef = afterId && Ref(Collection("users"), afterId);
    return this.client.query(GetTrendingUsers(afterRef))
      .then((res) => FaunaToJSON(res))
  }

  async getFollowingStatus(username) {
    return this.client
      .query(GetFollowingStatus(username))
      .then((res) => FaunaToJSON(res))
  }

  // SEARCH

  async searchPublications(string) {
    let parsedString = string
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()

    const match = await this.client
      .query(
        Map(Distinct(NGram(parsedString, 3, 3)), Lambda("trigram", Select(["data"], Paginate(Match(Index("publications_by_trigram"), Var("trigram"))))))
      )
      .then((res) => FaunaToJSON(res))

    console.log('match', match)

    let frequency = {}, value, childArray;
    for (let i = 0; i < match.length; i++) {
      childArray = match[i];
      if (childArray && childArray.length) {
        for (let j = 0; j < childArray.length; j++) {
          value = match[i][j];
          if (value in frequency) {
            frequency[value]++;
          }
          else {
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
          Lambda("id", GetPartialPublication(Ref(Collection("publications"), Var("id"))))
        )
      )
      .then((res) => FaunaToJSON(res))
  }


  // PUBLICATIONS CRUD

  async createPublication(body) {
    return this.client
      .query(CreatePublication(body))
      .then((res) => FaunaToJSON(res))
  }

  async getSinglePublication(id) {
    return this.client
      .query(GetSinglePublication(Ref(Collection("publications"), id)))
      .then((res) => FaunaToJSON(res))
  }

  async getPublicationStats(id) {
    return this.client
      .query(GetPublicationStats(Ref(Collection("publications"), id)))
      .then((res) => FaunaToJSON(res))
  }

  async getPublicationInteractions(id) {
    return this.client
      .query(GetPublicationInteractions(Ref(Collection("publications"), id)))
      .then((res) => FaunaToJSON(res))
  }

  async getTrendingPublications(afterId) {
    const afterRef = afterId && Ref(Collection("publications"), afterId);
    return this.client
      .query(GetTrendingPublications(afterRef))
      .then((res) => FaunaToJSON(res))
  }

  async getUserPublications(username, afterId) {
    const afterRef = afterId && Ref(Collection("publications"), afterId);
    return this.client
      .query(GetUserPublications(username, afterRef))
      .then((res) => FaunaToJSON(res))
  }

  async getPublications(afterId) {
    const afterRef = afterId && Ref(Collection("publications"), afterId);
    return this.client
      .query(GetPublications(afterRef))
      .then((res) => FaunaToJSON(res))
  }

  async getSavedPublication(after) {
    const afterRef = after && after.id && Ref(Collection(after.collection), after.id);
    return this.client
      .query(ViewSavedPublication(afterRef))
      .then((res) => FaunaToJSON(res))
  }

  async getPublicationByTag(tag_parsed) {
    return this.client
      .query(
        query.Map(
          Paginate(Join(Match(Index("publication_by_tag"), tag_parsed), Index("publication_sorted_popularity"))),
          Lambda(
            ["score", "ref", "title", "body", "created", "authorRef"],
            Let(
              {
                author: GetPartialUser(Var("authorRef")),
              },
              {
                ref: Var("ref"),
                title: Var("title"),
                body: Var("body"),
                created: Var("created"),
                author: Var("author"),
              }
            )
          )
        )
      )
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async updatePublication(id, body, isDraft, isQuestion) {
    return this.client
      .query(
        Let(
          {
            publication: Update(Ref(Collection("publications"), id), {
              data:
              {
                body,
                isDraft,
                isQuestion,
                publishedAt: If(isDraft, null, Now()),
              }
            }),
          },
          { id }
        )
      )
      .then((res) => FaunaToJSON(res))
  }

  async deletePublication(ref) {
    return this.client
      .query(DeletePublication(ref))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log('error', error)
        return { error: { message: error.message, description: error.description } };
      });
  }


}
