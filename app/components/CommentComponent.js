import { merge } from "lodash";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import Markdown from "@flowchase/react-native-markdown-display";
import React, { useState } from "react";

// Context
import zustandStore from "../contexts/zustandStore";

// Components
import VoteComponent from "./VoteComponent";

// Constants
import constants from "../utils/constants";

const CommentComponent = ({ commentData, depth, isReply, navigation }) => {
    const { commetsColorPallete, hasAccount, snoo } = zustandStore();

    const { id, author, body, replies } = commentData;
    const _depth = depth % commetsColorPallete.length;

    const [loadMore, setLoadMore] = useState(false);

    const colorScheme = useColorScheme();

    const Replies = () => {
        if (!replies.length) return null;

        if (depth >= 2 && !loadMore) {
            return (
                <Pressable onPress={() => setLoadMore(true)} style={styles.loadMoreButton}>
                    <Text
                        style={[
                            styles.loadMoreText,
                            colorScheme === "dark"
                                ? { color: constants.DARK_THEME_LIGHT_COLOR }
                                : null,
                        ]}
                    >
                        Load More Replies
                    </Text>
                </Pressable>
            );
        }

        return replies.map(reply => (
            <CommentComponent
                commentData={reply}
                navigation={navigation}
                depth={depth + 1}
                isReply={true}
                key={reply.id}
            />
        ));
    };

    return (
        <View
            style={[
                styles.commsContainer,
                colorScheme === "dark" ? styles.commsContainerDark : null,
                isReply
                    ? {
                          paddingStart: 20,
                          paddingEnd: 0,
                          borderStartWidth: 2,
                          marginStart: -2,
                          borderColor: depth > 0 ? commetsColorPallete[_depth] : "#f0f0f0",
                      }
                    : {
                          paddingHorizontal: 20,
                      },
            ]}
        >
            <Text
                style={[
                    styles.text,
                    styles.author,
                    colorScheme === "dark" ? { color: constants.DARK_THEME_LIGHT_COLOR } : null,
                ]}
            >
                {author.name}
            </Text>

            <Markdown
                style={
                    colorScheme === "dark"
                        ? merge({}, constants.MARKDOWN_FONT_FIX, constants.MARKDOWN_DARK_MODE_FIX)
                        : constants.MARKDOWN_FONT_FIX
                }
            >
                {body}
            </Markdown>

            {hasAccount && (
                <View style={styles.actionBar}>
                    <VoteComponent
                        postData={{ ...commentData, navigation }}
                        doUpvote={() => snoo.getComment(id).upvote()}
                        doDownvote={() => snoo.getComment(id).downvote()}
                        doRemoveVote={() => snoo.getComment(id).unvote()}
                    />
                </View>
            )}

            <Replies />
        </View>
    );
};

const styles = StyleSheet.create({
    commsContainer: {
        backgroundColor: "#fbfbfb",
        paddingVertical: 10,
        marginVertical: 5,
    },
    commsContainerDark: {
        backgroundColor: "#46474A",
    },
    text: {
        marginVertical: 5,
    },
    author: {
        fontWeight: "bold",
    },
    actionBar: {
        marginVertical: 7,
    },
    loadMoreButton: {
        backgroundColor: "hsla(0, 0%, 50%, 0.25)",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    loadMoreText: {
        color: "#505D74",
    },
});

CommentComponent.defaultProps = {
    isReply: false,
    depth: 0,
};

export default React.memo(CommentComponent);
