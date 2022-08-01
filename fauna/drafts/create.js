import { Let, query } from "faunadb";
const { Select, Create, Collection, Now } = query;

import { GetViewerRef } from "../authors/read";

const CreatePublicationDraft = (parsed_body) =>
    Let(
        {
            author: Call(Function("getViewer")),
            draft: Create(Collection("drafts"), {
                data: {
                    body: Var("parsed_body"),
                    createdAt: Now(),
                    author: Select,
                },
            }),
        },
        Select(["ref", "id"], Var("draft"))
    );

export default CreatePublicationDraft;
