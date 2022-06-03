/** @format */
import { Client, query } from "faunadb";

import { CreateContent } from "./content/create";
import { GetMinimalContent, ReadContent, ViewSavedContent, ViewTrendingContent, FollowingContent } from "./content/read";
import { Like, Dislike, Save } from './content/update';
import { DeleteContent } from "./content/delete";

import { CreateComment } from "./comments/create";
import { GetContentComments } from "./comments/read";

import { CreateUser } from "./users/create";
import { GetMinimalUser, GetSuggestedUsers, StalkUser, GetViewer, ViewUserContent, GetFollowers } from './users/read';
import { UpdateViewer, FollowUser } from "./users/update";

import FaunaToJSON from "./utils/FaunaToJSON";

const {
  Ref,
  Collection,
  Paginate,
  Join,
  Intersection,
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
      .catch((error) => {
        console.log("error", error);
        return null;
      });
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
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async getViewerAuthorStats(username) {
    return this.client
      .query(GetViewerAuthorStats(username))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return {};
      });
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

  async getViewerContentStats(ref) {
    const docType = ParseDocType(ref);
    return this.client
      .query(
        GetViewerContentStats(Ref(Collection(ref.collection), ref.id), docType)
      )
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async like(ref) {
    return this.client
      .query(Like(Ref(Collection(ref.collection), ref.id)))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async dislike(ref) {
    return this.client
      .query(Dislike(Ref(Collection(ref.collection), ref.id)))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async save(ref) {
    return this.client
      .query(Save(Ref(Collection(ref.collection), ref.id)))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  //COMMENTS CRUD

  async getContentComments(ref, afterId) {
    const afterRef = afterId ? Ref(Collection("comments"), afterId) : null;
    return this.client
      .query(GetContentComments(Ref(Collection(ref.collection), ref.id), afterRef))
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
    console.log('username', username)
    return this.client
      .query(StalkUser(username))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
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
      .catch((error) => {
        console.log("error", error);
      });
  }


  // SEARCH

  async search(string) {
    let word = string
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()

    return this.client
      .query(
        Map(
          Paginate(
            Intersection(
              Map(
                Union(
                  Let(
                    {
                      indexes: [4, 5, 6, 7, 8, 9, 10],
                      ngramsArray: Map(Var('indexes'), Lambda('l', NGram(word, Var('l'), Var('l'))))
                    },
                    Var('ngramsArray')
                  )
                ),
                Lambda('ngram', Match(
                  Index("search_index"),
                  Var("ngram"))
                )
              )
            ),
            {
              after: 0,
            }
          ),
          Lambda(["ref"],
            If(
              Equals(Collection("users"), Select(["collection"], Var("ref"))),
              GetMinimalUser(Var("ref")),
              GetMinimalContent(Var("ref"))
            )
          )
        )
      )
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return [];
      });

  }



  // CONTENT CRUD

  async createContent(data, type) {
    return this.client
      .query(CreateContent(data, type))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async getSingleContent(ref) {
    return this.client
      .query(
        ReadContent(Ref(Collection(ref.collection), ref.id))
      )
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async getTrendingContent(after) {
    const afterRef = after && after.id && Ref(Collection(after.collection), after.id);

    return this.client.query(ViewTrendingContent(afterRef))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
      });

  }

  async getUserContent(username, after) {
    const afterRef = after && after.id && Ref(Collection(after.collection), after.id);

    return this.client
      .query(ViewUserContent(username, afterRef))
      .then((res) => FaunaToJSON(res))
  }

  async getFollowingContent(after) {
    const afterRef = after && after.id && Ref(Collection(after.collection), after.id);

    return this.client.query(FollowingContent(afterRef))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
      });

  }

  async getSavedContent(after) {
    const afterRef = after && after.id && Ref(Collection(after.collection), after.id);
    return this.client
      .query(ViewSavedContent(afterRef))
      .then((res) => FaunaToJSON(res))
  }

  async getContentByTag(tag_parsed) {
    return this.client
      .query(
        query.Map(
          Paginate(Join(Match(Index("content_by_tag"), tag_parsed), Index("content_sorted_popularity"))),
          Lambda(
            ["score", "ref", "title", "body", "created", "authorRef"],
            Let(
              {
                author: GetMinimalUser(Var("authorRef")),
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

  async updateContent(ref, data) {
    return this.client
      .query(
        Let(
          {
            content: Update(Ref(Collection(ref.collection), ref.id), { data }),
          },
          { updated: true }
        )
      )
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error.message);
        return null;
      });
  }

  async deleteContent(ref) {
    return this.client
      .query(DeleteContent(ref))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log('error', error)
        return { error: { message: error.message, description: error.description } };
      });
  }


}
