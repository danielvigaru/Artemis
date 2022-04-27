import { useRef } from "react";
import { Video } from "expo-av";

// Utils
import calcCanvasHeight from "../utils/calc-canvas-height";

export default function VideoComponent({ postData, visiblePosts, isVideo, viewWidth }) {
    const { id, preview, secure_media, thumbnail } = postData;

    const videoRef = useRef(null);

    return (
        <Video
            ref={videoRef}
            style={[
                {
                    flex: 1,
                    width: null,
                    borderRadius: 10,
                    height: isVideo
                        ? calcCanvasHeight(secure_media.reddit_video, viewWidth)
                        : calcCanvasHeight(preview.reddit_video_preview, viewWidth),
                },
            ]}
            source={{
                uri: isVideo ? secure_media.reddit_video.hls_url : preview.reddit_video_preview.hls_url,
                overrideFileExtensionAndroid: "m3u8",
            }}
            isLooping={true}
            isMuted={true}
            posterSource={thumbnail}
            resizeMode="cover"
            shouldPlay={visiblePosts.includes(id)}
            useNativeControls={true}
        />
    );
}
