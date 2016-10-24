export function values (obj) {
    return Object.keys(obj).reduce((acc, key) => {
        acc.push(obj[key]);
        return acc;
    }, []);
}

export function hasValue (obj, val_to_find) {
    return !!((Array.isArray(obj)
        ? obj
        : values(obj)).indexOf(val_to_find) !== -1);
}

export function copyTo (obj_to, obj_from) {
    Object.keys(obj_from || {}).forEach((key) => obj_to[key] = obj_from[key]);
}
