export const searchStrip = input => {
    return input
        .trim()
        .toLowerCase()
        .replace(/\s/g, "");
};
