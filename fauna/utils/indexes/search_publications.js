import { query as q } from "faunadb"
const {
    Collection,
    CreateIndex,
    Query,
    Lambda,
    Var,
    Select,
    Let,
    NGram,
    LowerCase,
    Union,
    ReplaceStrRegex, Casefold
} = q;

export function CreateSearchIndex() {
    return CreateIndex({
        name: 'publications_by_trigram',
        source: [
            {
                collection: Collection('publications'),
                fields: {
                    trigrams: Query(
                        Lambda(
                            'publication',
                            Distinct(
                                NGram(
                                    LowerCase(
                                        ReplaceStrRegex(
                                            Casefold(
                                                Select(['data', 'body'], Var('publication')),
                                                "NFD"
                                            ),
                                            '[\u0300-\u036f]',
                                            ""
                                        )
                                    ),
                                    3,
                                    3
                                )
                            )
                        )
                    )
                }
            }
        ],
        terms: [
            {
                binding: 'trigrams'
            }
        ],
        values: [
            { field: ['ref'] }
        ],
        serialized: false
    })
}