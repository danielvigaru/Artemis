import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, ScrollView as View, Button, FlatList } from "react-native";
import * as Linking from "expo-linking";

import useStore from "../contexts/AccountZustand";
import useLogin from "../hooks/useLogin";

import FeedPost from "../components/FeedPost";

import constants from "../utils/constants";

import { deleteSecureData } from "../utils/storage";

export default function ProfileScreen() {
    const { account, doLogOut, hasAccount } = useStore();
    const { snoo, doLogin, handleDeepLink } = useLogin();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visiblePosts, setVisiblePosts] = useState([]);

    const handleLogOut = () => {
        setPosts([]);
        deleteSecureData(constants.REFRESH_TOKEN);
        snoo.revokeRefreshToken();
        doLogOut();
    };

    const fetchPosts = async () => {
        if (!hasAccount) return;
        const me = await snoo.getMe();
        const posts = await me.getSubmissions();

        setPosts(posts);
        setLoading(false);
    };

    const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        const viewableIds = viewableItems.map(viewable => viewable.item.id);
        setVisiblePosts(viewableIds);
    }, []);

    useEffect(() => {
        Linking.addEventListener("url", handleDeepLink);

        return () => {
            Linking.removeEventListener("url", handleDeepLink);
        };
    }, []);

    useEffect(() => {
        if (!snoo) return;
        setLoading(true);
        fetchPosts();
    }, [snoo]);

    const Card = ({ item }) => <FeedPost postData={item} visiblePosts={visiblePosts} />;

    const headerComponent = () => {
        return (
            <View>
                {account && account.name ? (
                    <Button title="Log out" onPress={handleLogOut} />
                ) : (
                    <Button title="Login" onPress={() => doLogin()} />
                )}
            </View>
        );
    };

    return (
        <FlatList
            data={posts}
            ListHeaderComponent={headerComponent}
            renderItem={Card}
            keyExtractor={item => item.id}
            refreshing={loading}
            onRefresh={fetchPosts}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
    );
}
