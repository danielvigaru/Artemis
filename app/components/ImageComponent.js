import { Image } from "react-native";
import { useMemo } from "react";

// Utilitare
import calcCanvasHeight from "../utils/calc-canvas-height";

export default function ImageComponent({ postData, viewWidth, roundedCorners }) {
    const { preview } = postData;

    const imageUrl = useMemo(() => {
        if (!preview.images || !preview.images[0].resolutions) return;

        const arr = preview.images[0].resolutions;
        const lastItem = arr[arr.length - 1];
        return lastItem.url;
    }, [postData]);

    return (
        <Image
            style={{
                flex: 1,
                width: null,
                borderRadius: roundedCorners ? 10 : 0,
            }}
            resizeMode="cover"
            resizeMethod="scale"
            source={{
                uri: imageUrl,
                height: calcCanvasHeight(preview.images[0].source, viewWidth),
            }}
        />
    );
}
