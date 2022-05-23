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
        name: 'search_index',
        source: [
            {
                collection: [Collection('Articles'), Collection('Questions'), Collection('memoramas')],
                fields: {
                    wordparts: Query(Lambda('content', Union(
                        Let(
                            {
                                indexes: [4, 5, 6, 7, 8, 9, 10],
                                ngramsArray: q.Map(Var('indexes'), Lambda('l', NGram(LowerCase(ReplaceStrRegex(
                                    Casefold(
                                        Select(['data', 'title'], Var('content')),
                                        "NFD"
                                    ),
                                    '[\u0300-\u036f]',
                                    ""
                                )), Var('l'), Var('l'))))
                            },
                            Var('ngramsArray')
                        )
                    )

                    )
                    )
                }
            },
            {
                collection: Collection('Users'),
                fields: {
                    wordparts: Query(
                        Lambda(
                            'user',
                            Union(
                                Union(
                                    Let(
                                        {
                                            indexes: [4, 5, 6, 7, 8, 9, 10],
                                            ngramsArray: Map(Var('indexes'), Lambda('l', NGram(LowerCase(ReplaceStrRegex(
                                                Casefold(
                                                    Select(['data', 'name'], Var('user')),
                                                    "NFD"
                                                ),
                                                '[\u0300-\u036f]',
                                                ""
                                            )), Var('l'), Var('l'))))
                                        },
                                        Var('ngramsArray')
                                    )
                                ),
                                Union(
                                    Let(
                                        {
                                            indexes: [4, 5, 6, 7, 8, 9, 10],
                                            ngramsArray: Map(Var('indexes'), Lambda('l', NGram(LowerCase(ReplaceStrRegex(
                                                Casefold(
                                                    Select(['data', 'username'], Var('user')),
                                                    "NFD"
                                                ),
                                                '[\u0300-\u036f]',
                                                ""
                                            )), Var('l'), Var('l'))))
                                        },
                                        Var('ngramsArray')
                                    )
                                )
                            )
                        )
                    )
                }
            }
        ],
        terms: [
            {
                binding: 'wordparts'
            }
        ],
        values: [
            { field: ['ref'] }
        ],
        serialized: false
    })
}