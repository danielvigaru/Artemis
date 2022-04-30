import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";

// Context
import accountStore from "../contexts/AccountZustand";
import postsStore from "../contexts/PostsZustand";

// Components
import PostComponent from "./PostComponent";

const FeedPost = ({ postData, navigation }) => {
    const { setFeedSelectedPostId } = postsStore();

    const handleOpenPost = () => {
        if (navigation) {
            setFeedSelectedPostId(postData.id);
            navigation.navigate("PostDetails");
        }
    };

    return (
        <Pressable
            onPress={handleOpenPost}
            style={({ pressed }) => [
                styles.container,
                { backgroundColor: pressed ? "#f9f9f9" : "#fff" },
            ]}
        >
            <PostComponent postData={postData} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderColor: "#f0f0f0",
        borderWidth: StyleSheet.hairlineWidth,
        flex: 1,
        justifyContent: "center",
        marginVertical: 5,
        padding: 15,
    },
});

export default React.memo(FeedPost);
