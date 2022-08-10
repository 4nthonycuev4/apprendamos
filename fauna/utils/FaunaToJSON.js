export default function FaunaToJSON(obj) {
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return;
        }
        return obj.map((e) => FaunaToJSON(e));
    }
    if (typeof obj === "object") {
        if (obj.collection && obj.id) {
            return {
                id: obj.id,
                collection: obj.collection.id,
            };
        }

        if (obj.value) {
            return obj.value;
        }

        Object.keys(obj).forEach((k) => {
            if (obj[k] === null || obj[k] === undefined) {
                delete obj[k];
            } else {
                obj[k] = FaunaToJSON(obj[k]);
            }
        });
    }
    return obj;
}
