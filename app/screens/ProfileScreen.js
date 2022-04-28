import { Button, FlatList, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import React, { useEffect, useState, useCallback } from "react";

// Hooks
import useLogin from "../hooks/useLogin";

// Components
import FeedPost from "../components/FeedPost";

// Context
import accountStore from "../contexts/AccountZustand";
import postsStore from "../contexts/PostsZustand";

// Constants
import constants from "../utils/constants";

// Utils
import { deleteSecureData } from "../utils/storage";

// Screens
import PostScreen from "./PostScreen";

const Stack = createNativeStackNavigator();

export default function ProfileScreen() {
    const { account, doLogOut, hasAccount } = accountStore();
    const { snoo, doLogin, handleDeepLink } = useLogin();
    const { feedSelectedPostId } = postsStore();

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

    const Card = ({ item }) => (
        <FeedPost postData={item} visiblePosts={visiblePosts} navigation={item.navigation} />
    );

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
        <Stack.Navigator>
            <Stack.Screen name="PostList" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <FlatList
                        data={posts.map(post => ({ ...post, navigation }))}
                        keyExtractor={item => item.id}
                        ListHeaderComponent={headerComponent}
                        onRefresh={fetchPosts}
                        onViewableItemsChanged={onViewableItemsChanged}
                        refreshing={loading}
                        renderItem={Card}
                        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="PostDetails" options={{ headerShown: false }}>
                {() => <PostScreen posts={posts} postId={feedSelectedPostId} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
