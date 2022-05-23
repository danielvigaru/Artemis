import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

// Context
import zustandStore from "../contexts/zustandStore";

// Components
import VoteComponent from "./VoteComponent";

const CommentComponent = ({ commentData, depth, isReply, navigation }) => {
    const { commetsColorPallete, hasAccount } = zustandStore();

    const { author, body, replies } = commentData;
    const _depth = depth % commetsColorPallete.length;

    const [loadMore, setLoadMore] = useState(false);

    const Replies = () => {
        if (!replies.length) return null;

        if (depth >= 2 && !loadMore) {
            return (
                <Pressable onPress={() => setLoadMore(true)} style={styles.loadMoreButton}>
                    <Text style={styles.loadMoreText}>Load More Replies</Text>
                </Pressable>
            );
        }

        return replies.map(reply => (
            <CommentComponent commentData={reply} depth={depth + 1} isReply={true} key={reply.id} />
        ));
    };

    return (
        <View
            style={[
                styles.commsContainer,
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
            <Text style={[styles.text, styles.author]}>{author.name}</Text>

            <Text>{body}</Text>

            {hasAccount && (
                <View style={styles.actionBar}>
                    <VoteComponent postData={{ ...commentData, navigation }} />
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
