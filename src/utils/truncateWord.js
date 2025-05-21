function truncateWords(str, maxWords = 15) {
    const words = str.trim().split(/\s+/);
    if (words.length <= maxWords) return str;
    return words.slice(0, maxWords).join(" ") + "...";
}
export default truncateWords;
