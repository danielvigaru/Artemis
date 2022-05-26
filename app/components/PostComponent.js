import { merge } from "lodash";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import Markdown from "@flowchase/react-native-markdown-display";
import React, { useMemo, useState } from "react";

// Constants
import constants from "../utils/constants";

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

    const colorScheme = useColorScheme();

    // Memoization
    const contentType = useMemo(() => getSubmissionType(postData), [postData]);

    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setViewWidth(width);
    };

    return (
        <View
            style={[
                styles.wrapper,
                colorScheme === "dark"
                    ? {
                          backgroundColor: "#46474A",
                      }
                    : null,
            ]}
        >
            <Text style={[styles.title, colorScheme === "dark" ? styles.textLight : null]}>
                {title}
            </Text>

            <Text style={[styles.subName, colorScheme === "dark" ? styles.textLight : null]}>
                {subreddit_name_prefixed}
            </Text>

            <View style={styles.postContent} onLayout={onLayout}>
                {contentType === "selftext" &&
                    (isPostScreen ? (
                        <Markdown
                            style={
                                colorScheme === "dark"
                                    ? merge(
                                          {},
                                          constants.MARKDOWN_FONT_FIX,
                                          constants.MARKDOWN_DARK_MODE_FIX
                                      )
                                    : constants.MARKDOWN_FONT_FIX
                            }
                        >
                            {selftext}
                        </Markdown>
                    ) : (
                        <Markdown
                            style={
                                colorScheme === "dark"
                                    ? merge(
                                          {},
                                          constants.MARKDOWN_FONT_FIX,
                                          constants.MARKDOWN_DARK_MODE_FIX
                                      )
                                    : constants.MARKDOWN_FONT_FIX
                            }
                        >
                            {truncateText(selftext, 150)}
                        </Markdown>
                    ))}

                {contentType === "image" && (
                    <ImageComponent
                        postData={postData}
                        viewWidth={viewWidth}
                        roundedCorners={true}
                    />
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
                    postData={postData}
                    doUpvote={() => snoo.getSubmission(id).upvote()}
                    doDownvote={() => snoo.getSubmission(id).downvote()}
                    doRemoveVote={() => snoo.getSubmission(id).unvote()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        padding: 15,
    },
    textLight: {
        color: constants.DARK_THEME_LIGHT_COLOR,
    },
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
