export default function calcCanvasHeight(source, viewWidth) {
    const { width, height } = source;
    if (height <= 400) return height;

    const ratio = width / height;
    const newHeight = Math.ceil(viewWidth / ratio);

    return newHeight;
}
