import { useRef } from "react";
import { Video } from "expo-av";

// Context
import zustandStore from "../contexts/zustandStore";

// Utilitare
import calcCanvasHeight from "../utils/calc-canvas-height";

export default function VideoComponent({ postData, isVideo, viewWidth }) {
    const { id, preview, secure_media, thumbnail } = postData;

    const { visiblePosts, selectedPost } = zustandStore();

    const videoRef = useRef(null);

    const autoPlayVideo = id === selectedPost || visiblePosts.includes(id);

    return (
        <Video
            ref={videoRef}
            style={[
                {
                    width: null,
                    borderRadius: 10,
                    height: isVideo
                        ? calcCanvasHeight(secure_media.reddit_video, viewWidth)
                        : calcCanvasHeight(preview.reddit_video_preview, viewWidth),
                },
            ]}
            source={{
                uri: isVideo
                    ? secure_media.reddit_video.hls_url
                    : preview.reddit_video_preview.hls_url,
                overrideFileExtensionAndroid: "m3u8",
            }}
            isLooping={true}
            isMuted={true}
            posterSource={thumbnail}
            resizeMode="cover"
            shouldPlay={autoPlayVideo}
            useNativeControls={true}
        />
    );
}
