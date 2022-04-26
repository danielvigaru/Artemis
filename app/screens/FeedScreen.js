import { SafeAreaView, FlatList, StyleSheet, StatusBar } from "react-native";
import React, { useEffect, useState, useCallback } from "react";

// Components
import FeedPost from "../components/FeedPost";

// Context
import useStore from "../contexts/AccountZustand";

// API
import doUserlessAction from "../API/userless/do-userless-action";

export default function FeedScreen() {
    const { snoo, hasAccount, finishedLogin } = useStore();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visiblePosts, setVisiblePosts] = useState([]);

    const fetchPosts = async () => {
        setLoading(true);

        if (hasAccount) {
            const posts = await snoo.getBest();
            setPosts(posts);
        } else {
            const userless = await doUserlessAction();
            const posts = await userless.getBest();

            setPosts(posts);
        }

        setLoading(false);
    };

    onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        const viewableIds = viewableItems.map(viewable => viewable.item.id);
        setVisiblePosts(viewableIds);
    }, []);

    useEffect(() => {
        if (!finishedLogin) return;

        fetchPosts();
    }, [finishedLogin, hasAccount]);

    useEffect(() => {
        console.log("feed page posts changed");
    }, [posts]);

    const card = ({ item }) => <FeedPost postData={item} visiblePosts={visiblePosts} />;

    return (
        <FlatList
            data={posts}
            renderItem={card}
            keyExtractor={item => item.id}
            onRefresh={fetchPosts}
            refreshing={loading}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: "#f9c2ff",
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});
