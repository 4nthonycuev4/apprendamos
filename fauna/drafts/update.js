import { query } from "faunadb";
const { Select, Update } = query;

const UpdatePublicationDraft = (ref, body) =>
    Select(
        ["ref", "id"],
        Update(ref, {
            data: {
                body,
            },
        })
    );

export default UpdatePublicationDraft;
