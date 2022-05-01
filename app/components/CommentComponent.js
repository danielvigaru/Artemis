import { StyleSheet, Text, View } from "react-native";
import React from "react";

// Context
import zustandStore from "../contexts/zustandStore";

// Components
import VoteComponent from "./VoteComponent";

const CommentComponent = ({ commentData, depth, isReply }) => {
    const { commetsColorPallete, hasAccount, snoo } = zustandStore();

    const { author, body, downs, id, likes, replies, ups } = commentData;
    const _depth = depth % commetsColorPallete.length;

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
                    <VoteComponent
                        upvotes={ups}
                        downvotes={downs}
                        doUpvote={() => snoo.getComment(id).upvote()}
                        doDownvote={() => snoo.getComment(id).downvote()}
                        voted={likes}
                        doRemoveVote={() => snoo.getComment(id).unvote()}
                    />
                </View>
            )}

            {replies &&
                replies.map(reply => (
                    <CommentComponent
                        commentData={reply}
                        depth={depth + 1}
                        isReply={true}
                        key={reply.id}
                    />
                ))}
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
});

CommentComponent.defaultProps = {
    isReply: false,
    depth: 0,
};

export default React.memo(CommentComponent);
