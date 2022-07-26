import { query } from "faunadb";
const { Let, Select, Get, Var } = query;

const GetSinglePublicationDraft = (ref) =>
    Let(
        {
            publication: Get(ref),
        },
        {
            body: Select(["data", "body"], Var("publication")),
            createdAt: Select(["data", "createdAt"], Var("publication")),
        }
    );

export default GetSinglePublicationDraft;
