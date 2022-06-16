import { Pressable, StyleSheet } from "react-native";
import React from "react";

// Context
import zustandStore from "../contexts/zustandStore";

// Componente
import PostComponent from "./PostComponent";

const FeedPost = ({ postData, navigation }) => {
    const { setSelectedPost } = zustandStore();

    const handleOpenPost = () => {
        setSelectedPost(postData.id);
        navigation.navigate("PostDetails");
    };

    return (
        <Pressable
            onPress={handleOpenPost}
            style={({ pressed }) => [
                styles.container,
                { backgroundColor: pressed ? "#f9f9f9" : "#fff" },
            ]}
        >
            <PostComponent postData={{ ...postData, navigation }} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginVertical: 5,
    },
});

export default React.memo(FeedPost);
