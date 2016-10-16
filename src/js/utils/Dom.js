export function cell (tag, class_name = false, attributes = {}, parent = null, is_svg = false) {
    //  Create element, use svg namespace if required
    const el = !is_svg
        ? document.createElement(tag)
        : document.createElementNS('http://www.w3.org/2000/svg', tag);

    //   Append to parent if passed
    if (parent) parent.appendChild(el);

    //   Set attributes
    if (class_name) {
        (Array.isArray(class_name)
            ? class_name
            : [class_name]
        ).forEach((cname) => el.classList.add(cname));
    }

    Object.keys(attributes || {}).forEach(
       (key) => el.setAttribute(key, attributes[key])
    );

   return el;
}

export function isElement (obj) {
    return "HTMLElement" in window
        ? !!(obj && obj instanceof HTMLElement) // DOM, Level2
        : !!(obj && typeof obj === "object" && obj.nodeType === 1 && obj.nodeName); // Older browsers
}
