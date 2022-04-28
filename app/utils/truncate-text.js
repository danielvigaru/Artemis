import getPositionOfLastSpaceBeforeIndex from "./get-position-of-last-space-before-index";

/**
 * Truncates text on the last space before the given index, and adds '...' at the end
 * @param {String} text Text to be truncated
 * @param {Number} maxLength Desired max length. Output might be shorter because it's truncated on the last space found before the given maxLength
 * @returns Truncated text
 */

export default function truncateText(text, maxLength) {
    const _text = text.trim();

    if (_text.length <= maxLength) return _text;

    const indexOfLastSpace = getPositionOfLastSpaceBeforeIndex(_text, maxLength);
    const truncatedText = _text.slice(0, indexOfLastSpace) + "...";

    return truncatedText;
}
