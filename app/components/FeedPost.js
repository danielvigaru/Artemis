import { Platform } from "react-native";
import { Pressable, StyleSheet, Text, View, Image, Button } from "react-native";
import React, { useMemo, useState } from "react";

// Utils
import calcCanvasHeight from "../utils/calc-canvas-height";
import truncateText from "../utils/truncate-text";

// Components
import LinkComponent from "./LinkComponent";
import VideoComponent from "./VideoComponent";

const FeedPost = ({ postData, visiblePosts }) => {
    const { title, selftext, ups: upvotes, id, preview, subreddit_name_prefixed } = postData;

    // State
    const [viewWidth, setViewWidth] = useState(-1);

    const truncate = (text, length) => {
        return text.length > length ? truncateText(text, length) : text;
    };

    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setViewWidth(width);
    };

    // Memoization
    const contentType = useMemo(() => {
        const { is_self, preview, is_video } = postData;

        if (is_self) return "selftext";
        if (is_video) return "video";
        if (preview) {
            if (preview.reddit_video_preview && preview.reddit_video_preview.is_gif) return "gif";
            if (preview.images) return "image";
        }

        return "link";
    }, [postData]);

    const imageUrl = useMemo(() => {
        if (contentType !== "image") return "";

        if (preview.images && preview.images[0].resolutions) {
            const arr = preview.images[0].resolutions;
            const lastItem = arr[arr.length - 3]; // quality of the image, highest quality: preview.images[0].source.url
            return lastItem.url;
        }
    }, [postData, contentType]);

    const handleOpenPost = () => {
        console.log("opening post", id);
        console.log("contentType", contentType);
    };

    return (
        <View>
            <Pressable
                onPress={handleOpenPost}
                style={({ pressed }) => [styles.container, { backgroundColor: pressed ? "#f9f9f9" : "#fff" }]}
            >
                <Text style={[styles.text, styles.bold]}>{title}</Text>
                <Text style={styles.subName}>{subreddit_name_prefixed}</Text>

                <View style={styles.postContent} onLayout={onLayout}>
                    {contentType === "selftext" && <Text>{truncate(selftext, 150)}</Text>}

                    {contentType === "image" && (
                        <Image
                            style={styles.image}
                            source={{
                                uri: imageUrl,
                                height: calcCanvasHeight(preview.images[0].source, viewWidth),
                            }}
                            resizeMode="cover"
                            resizeMethod="scale"
                        />
                    )}

                    {(contentType === "video" || contentType === "gif") && (
                        <VideoComponent
                            postData={postData}
                            visiblePosts={visiblePosts}
                            isVideo={contentType === "video"}
                            viewWidth={viewWidth}
                        />
                    )}

                    {contentType === "link" && <LinkComponent url={postData.url} displayUrl={postData.domain} />}
                </View>

                <Text style={styles.buttons}>{`${upvotes} ⬆️`}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
    },
    subName: {
        marginTop: 5,
        fontSize: 13,
    },
    bold: {
        fontWeight: "bold",
    },
    postContent: {
        marginVertical: 20,
    },
    container: {
        padding: 6,
        backgroundColor: "#f9f9f9",
        borderColor: "#f0f0f0",
        borderWidth: StyleSheet.hairlineWidth,
        flex: 1,
        justifyContent: "center",
        marginVertical: 5,
        padding: 15,
    },
    image: {
        flex: 1,
        width: null,
        borderRadius: 10,
    },
    buttons: {
        marginTop: 5,
        alignSelf: "flex-end",
    },
});

export default React.memo(FeedPost);
