import { query } from "faunadb";
const { Select, Create, Collection, Now } = query;

import { GetViewerRef } from "../users/read";

const CreatePublicationDraft = (body) =>
    Select(
        ["ref", "id"],
        Create(Collection("publications"), {
            data: {
                body,
                isDraft: true,
                createdAt: Now(),
                author: GetViewerRef(),
            },
        })
    );

export default CreatePublicationDraft;
