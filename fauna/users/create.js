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
      user: Create(Collection("users"), {
        data: {
          ...data,
          joinedAt: Now(),
        },
      }),
      rel: Create(Collection("authoruser"), {
        data: {
          user: Select(["ref"], Var("user")),
          author: Select(["ref"], Var("user")),
          following: true,
          createdAt: Now(),
        }
      }),
      account: Create(Collection("accounts"), {
        data: {
          connection: CurrentIdentity(),
          user: Select(["ref"], Var("user")),
          createdAt: Now(),
        },
      }),
    },
    true
  );
}