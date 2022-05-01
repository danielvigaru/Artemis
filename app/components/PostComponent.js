import { StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";

// Context
import zustandStore from "../contexts/zustandStore";

// Utils
import getSubmissionType from "../utils/get-submission-type";
import truncateText from "../utils/truncate-text";

// Components
import ImageComponent from "./ImageComponent";
import LinkComponent from "./LinkComponent";
import VideoComponent from "./VideoComponent";
import VoteComponent from "./VoteComponent";

const PostComponent = ({ postData, isPostScreen }) => {
    const { id, selftext, subreddit_name_prefixed, title } = postData;

    const { snoo, hasAccount } = zustandStore();

    // State
    const [viewWidth, setViewWidth] = useState(-1);

    // Memoization
    const contentType = useMemo(() => getSubmissionType(postData), [postData]);

    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setViewWidth(width);
    };

    return (
        <View>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.subName}>{subreddit_name_prefixed}</Text>

            <View style={styles.postContent} onLayout={onLayout}>
                {contentType === "selftext" ? (
                    isPostScreen ? (
                        <Text>{selftext}</Text>
                    ) : (
                        <Text>{truncateText(selftext, 150)}</Text>
                    )
                ) : null}

                {contentType === "image" && (
                    <ImageComponent postData={postData} viewWidth={viewWidth} />
                )}

                {(contentType === "video" || contentType === "gif") && (
                    <VideoComponent
                        postData={postData}
                        isVideo={contentType === "video"}
                        viewWidth={viewWidth}
                    />
                )}

                {(contentType === "link" || contentType === "link-with-preview") && (
                    <LinkComponent postData={postData} viewWidth={viewWidth} />
                )}
            </View>

            {hasAccount && (
                <VoteComponent
                    upvotes={postData.ups}
                    doUpvote={() => snoo.getSubmission(id).upvote()}
                    downvotes={postData.downs}
                    doDownvote={() => snoo.getSubmission(id).downvote()}
                    voted={postData.likes}
                    doRemoveVote={() => snoo.getSubmission(id).unvote()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    subName: {
        marginTop: 5,
        fontSize: 13,
    },
    postContent: {
        marginVertical: 20,
    },
});

export default React.memo(PostComponent);
