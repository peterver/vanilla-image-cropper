export function convertGlobalToLocal (evt, comparison) {
    const x = evt.clientX - comparison.left;
    const y = evt.clientY - comparison.top;

    return {
        //  Make sure X is always within the bounds of our dimensions
        x : x < 0 ? 0 : (x > comparison.width ? comparison.width : x),
        //  Make sure Y is always within the bounds of our dimensions
        y : y < 0 ? 0 : (y > comparison.height ? comparison.height : y),
    };
}
