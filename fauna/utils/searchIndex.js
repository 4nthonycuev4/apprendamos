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
    Union
} = q;
function WordPartGenerator(WordVar) {
    return Let(
        {
            indexes: q.Map(
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
                Lambda('index', Subtract(Length(WordVar), Var('index')))
            ),
            indexesFiltered: Filter(
                Var('indexes'),
                Lambda('l', GT(Var('l'), 2))
            ),
            ngramsArray: q.Map(Var('indexesFiltered'), Lambda('l', NGram(LowerCase(WordVar), Var('l'), Var('l'))))
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
                    wordparts: Query(Lambda('content', Union(WordPartGenerator(Select(['data', 'title'], Var('content'))))))
                }
            },
            {
                collection: Collection('Users'),
                fields: {
                    wordparts: Query(
                        Lambda(
                            'user',
                            Union(
                                Union(WordPartGenerator(Select(['data', 'name'], Var('user')))),
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