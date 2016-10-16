export function values (obj) {
    return Object.keys(obj).reduce((acc, key) => {
        acc.push(obj[key]);
        return acc;
    }, []);
}

export function hasValue (obj, val_to_find) {
    let contains = false;

    values(obj).forEach((val) => {
        if (contains || val === val_to_find) {
            contains = true;
        }
    });
    return contains;
}
