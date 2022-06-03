export default function FaunaToJSON(obj) {
    if (Array.isArray(obj)) {
        return obj.map((e) => FaunaToJSON(e));
    }
    if (typeof obj === "object") {
        if (obj.after || obj.before) {
            if (obj.after && obj.after[0] !== false) {
                return {
                    after: FaunaToJSON(obj.after.at(-1)),
                    data: FaunaToJSON(obj.data),
                };
            }
            return {
                after: false,
                data: FaunaToJSON(obj.data),
            }
        }

        if (obj.ref && obj.data) {
            return {
                id: `${obj.ref.collection.id}/${obj.ref.id}`,
                ...FaunaToJSON(obj.data),
            };
        }

        if (obj.collection && obj.id) {
            return `${obj.collection.id}/${obj.id}`;
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