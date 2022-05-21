import { query as q } from "faunadb"
const {
    Call,
    Create,
    Collection,
    CurrentIdentity,
    CreateIndex,
    Query,
    Paginate,
    Documents,
    Lambda,
    Get,
    Var,
    Select,
    Let,
    Match,
    Index,
    Join,
    If,
    Exists,
    Update,
    Do,
    Add,
    Subtract,
    Not,
    Contains,
    Abort,
    Now,
    Filter,
    NGram,
    LowerCase,
    Length,
    GT,
    Union,
    ReplaceStrRegex, Casefold
} = q;
export function WordPartGenerator(WordVar) {
    return Let(
        {
            indexes: [3, 4, 5, 6, 10],
            ngramsArray: q.Map(Var('indexes'), Lambda('l', NGram(LowerCase(WordVar), Var('l'), Var('l'))))
        },
        Var('ngramsArray')
    )
}

export function CreateSearchIndex() {
    return CreateIndex({
        name: 'search_index',
        source: [
            {
                collection: [Collection('Posts'), Collection('Questions'), Collection('Flashquizzes')],
                fields: {
                    wordparts: Query(Lambda('content', Union(WordPartGenerator(
                        ReplaceStrRegex(
                            Casefold(
                                Select(['data', 'title'], Var('content')),
                                "NFD"
                            ),
                            '[\u0300-\u036f]',
                            ""
                        )
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
                                Union(WordPartGenerator(ReplaceStrRegex(Casefold(Select(['data', 'name'], Var('user')), "NFD"), '[\u0300-\u036f]', ""))),
                                Union(WordPartGenerator(Select(['data', 'username'], Var('user'))))
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