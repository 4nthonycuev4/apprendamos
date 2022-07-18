export default function FaunaToJSON(obj) {
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return;
        }
        return obj.map((e) => FaunaToJSON(e));
    }
    if (typeof obj === "object") {
        if (obj.after || obj.before) {
            if (obj.after) {
                return {
                    afterId: FaunaToJSON(obj.after[obj.after.length - 1]),
                    data: FaunaToJSON(obj.data),
                };
            }
            return {
                afterId: false,
                data: FaunaToJSON(obj.data),
            }
        }

        if (obj.ref && obj.data) {
            return {
                id: obj.ref.id,
                ...FaunaToJSON(obj.data),
            };
        }

        if (obj.collection && obj.id) {
            return obj.id;
        }

        if (obj.value) {
            return obj.value;
        }

        Object.keys(obj).forEach((k) => {
            if (k === "data") {
                const d = obj[k]
                delete obj.data

                Object.keys(d).forEach(dataKey => {
                    obj[dataKey] = FaunaToJSON(d[dataKey])
                })

            } else if (obj[k] === null || obj[k] === undefined) {
                delete obj[k];
            } else {
                obj[k] = FaunaToJSON(obj[k]);
            }
        });
    }
    return obj;
}