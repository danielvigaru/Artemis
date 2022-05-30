import { ActivityIndicator, useColorScheme } from "react-native";
import { StackActions } from "@react-navigation/native";
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import React, { useState, useMemo } from "react";

// FontAwesome
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// Constants
import constants from "../utils/constants";

// Context
import zustandStore from "../contexts/zustandStore";

// Utils
import isComment from "../API/is-comment";

const REDDIT_COMMENT_MAX_CHARS = 10000;

export default function CommentScreen({ postId, navigation }) {
    const { snoo } = zustandStore();

    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState("");

    const colorScheme = useColorScheme();

    const onChangeText = text => {
        setCommentText(text);
    };

    const handleSendComment = async () => {
        setLoading(true);

        const isReplyingToComment = await isComment(postId);

        if (isReplyingToComment) {
            snoo.getComment(postId).reply(commentText);
        } else {
            snoo.getSubmission(postId).reply(commentText);
        }

        setTimeout(() => {
            navigation.dispatch(StackActions.pop(1));
        }, 1500);
    };

    const commentTooLong = useMemo(
        () => commentText.length >= REDDIT_COMMENT_MAX_CHARS,
        [commentText]
    );

    const sendButtonDisabled = useMemo(
        () => commentTooLong || commentText.length === 0,
        [commentTooLong, commentText]
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TextInput
                autoFocus
                editable
                multiline
                autoCorrect={false}
                maxLength={REDDIT_COMMENT_MAX_CHARS}
                onChangeText={onChangeText}
                placeholder="Write a nice comment"
                placeholderTextColor={colorScheme === "dark" ? "#fff" : "#585858"}
                style={[styles.comment, colorScheme === "dark" ? styles.commentDark : null]}
                value={commentText}
            />

            {commentTooLong && (
                <Text style={{ color: "red", alignSelf: "center" }}>
                    Comments cannot be longer than {REDDIT_COMMENT_MAX_CHARS} characters
                </Text>
            )}

            <Pressable onPress={handleSendComment} disabled={sendButtonDisabled}>
                <View
                    style={[
                        styles.sendButton,
                        sendButtonDisabled ? { backgroundColor: "#EBEBE4" } : null,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <FontAwesomeIcon icon={faPaperPlane} color="#fff" size={20} />
                    )}
                </View>
            </Pressable>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    comment: {
        backgroundColor: "#fbfbfb",
        borderRadius: 15,
        margin: 10,
        padding: 15,
        maxHeight: "82%",
        paddingTop: 15,
        fontSize: 17,
    },
    commentDark: {
        backgroundColor: "#5C616A",
        color: "white",
    },
    sendButton: {
        alignItems: "center",
        backgroundColor: constants.REDDIT_COLOR,
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
});
