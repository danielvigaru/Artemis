export default function formatBigNumber(num) {
    if (num < 999) {
        return num;
    }

    if (num >= 1e3 && num < 1e6) {
        return (num / 1e3).toFixed(1) + "k";
    }

    if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + "m";
    }
}
