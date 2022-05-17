/** @format */
import { query } from "faunadb";

const {
  CurrentIdentity,
  Get,
  Var,
  Collection,
  Let,
  Select,
  Create,
  Now,
  Update,
  Do,
  Add,
} = query;

export function CreateUser(data) {
  return Let(
    {
      user: Create(Collection("Users"), {
        data: {
          ...data,
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
          },
        },
      }),
      account: Create(Collection("Accounts"), {
        data: {
          connection: CurrentIdentity(),
          userRef: Select(["ref"], Var("user")),
        },
      }),
      wallet: Create(Collection("Wallets"), {
        data: {
          userRef: Select(["ref"], Var("user")),
          income: 0,
          expenses: 0,
          created: Now(),
        },
      }),
    },
    { user: Var("user") }
  );
}
