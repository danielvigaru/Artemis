import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";

// Context
import accountStore from "../contexts/AccountZustand";
import postsStore from "../contexts/PostsZustand";

// Utils
import getSubmissionType from "../utils/get-submission-type";
import truncateText from "../utils/truncate-text";

// Components
import ImageComponent from "./ImageComponent";
import LinkComponent from "./LinkComponent";
import VideoComponent from "./VideoComponent";
import VoteComponent from "./VoteComponent";

const FeedPost = ({ postData, visiblePosts, navigation }) => {
    const { id, selftext, subreddit_name_prefixed, title } = postData;

    const { snoo } = accountStore();
    const { setFeedSelectedPostId } = postsStore();

    // State
    const [viewWidth, setViewWidth] = useState(-1);

    // Memoization
    const contentType = useMemo(() => getSubmissionType(postData), [postData]);

    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setViewWidth(width);
    };

    const handleOpenPost = () => {
        if (navigation) {
            setFeedSelectedPostId(id);
            navigation.navigate("PostDetails");
        }
    };

    return (
        <View>
            <Pressable
                onPress={handleOpenPost}
                style={({ pressed }) => [
                    styles.container,
                    { backgroundColor: pressed ? "#f9f9f9" : "#fff" },
                ]}
            >
                <Text style={[styles.text, styles.bold]}>{title}</Text>
                <Text style={styles.subName}>{subreddit_name_prefixed}</Text>

                <View style={styles.postContent} onLayout={onLayout}>
                    {contentType === "selftext" && <Text>{truncateText(selftext, 150)}</Text>}

                    {contentType === "image" && (
                        <ImageComponent postData={postData} viewWidth={viewWidth} />
                    )}

                    {(contentType === "video" || contentType === "gif") && (
                        <VideoComponent
                            postData={postData}
                            visiblePosts={visiblePosts}
                            isVideo={contentType === "video"}
                            viewWidth={viewWidth}
                        />
                    )}

                    {(contentType === "link" || contentType === "link-with-preview") && (
                        <LinkComponent postData={postData} viewWidth={viewWidth} />
                    )}
                </View>

                <VoteComponent
                    upvotes={postData.ups}
                    doUpvote={() => snoo.getSubmission(id).upvote()}
                    downvotes={postData.downs}
                    doDownvote={() => snoo.getSubmission(id).downvote()}
                    voted={postData.likes}
                    doRemoveVote={() => snoo.getSubmission(id).unvote()}
                />
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
        borderColor: "#f0f0f0",
        borderWidth: StyleSheet.hairlineWidth,
        flex: 1,
        justifyContent: "center",
        marginVertical: 5,
        padding: 15,
    },
    buttons: {
        marginTop: 5,
        alignSelf: "flex-end",
    },
});

export default React.memo(FeedPost);
