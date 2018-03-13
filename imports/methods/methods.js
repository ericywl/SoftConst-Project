export const searchStrip = input => {
    return input.toLowerCase().replace(/[^\w\s#,]/gi, "");
};
