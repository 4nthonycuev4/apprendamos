Let(
    {
        "results": [[1, 2, 3], [3, 2], [3, 4, 5, 1, 2], [3, 7, 9], [3, 10]],
        "uniques": Union(Var("results")),
        "oc": Map(
            Var("uniques"),
            Lambda(
                "i",
                Let(
                    {
                        "count": 0,
                        "results": Map(
                            Var("results"),
                            Lambda(
                                "j",
                                If(

                                )
                            )
                        )
                    },
                    {
                        "count": Count(Var("results")),
                        "id": Var("i")
                    }
                )
            )
        )
    }
)