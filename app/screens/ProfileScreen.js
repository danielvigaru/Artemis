import { Button, FlatList, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import React, { useEffect, useState, useRef } from "react";

// Hooks
import useLogin from "../hooks/useLogin";

// Componente
import FeedPost from "../components/FeedPost";

// Context
import zustandStore from "../contexts/zustandStore";

// Constante
import constants from "../utils/constants";

// Utilitare
import { deleteSecureData } from "../utils/storage";

// Ecrane
import CommentScreen from "./CommentScreen";
import PostScreen from "./PostScreen";

const Stack = createNativeStackNavigator();

export default function ProfileScreen() {
    const { doLogin, handleDeepLink } = useLogin();

    const {
        account,
        doLogOut,
        hasAccount,
        selectedPost,
        selectedPostForComment,
        setVisiblePosts,
        snoo,
    } = zustandStore();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });
    const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
        const viewableIds = viewableItems.map(viewable => viewable.item.id);
        setVisiblePosts(viewableIds);
    });

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

    const Card = ({ item }) => <FeedPost postData={item} navigation={item.navigation} />;

    const headerComponent = () => {
        return account && account.name ? (
            <Button title="Log out" onPress={handleLogOut} />
        ) : (
            <Button title="Login" onPress={() => doLogin()} />
        );
    };

    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile">
                {({ navigation }) => (
                    <FlatList
                        data={posts.map(post => ({ ...post, navigation }))}
                        keyExtractor={item => item.id}
                        ListHeaderComponent={headerComponent}
                        onRefresh={fetchPosts}
                        onViewableItemsChanged={onViewableItemsChanged.current}
                        refreshing={loading}
                        renderItem={Card}
                        viewabilityConfig={viewabilityConfig.current}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen name="PostDetails" options={{ title: "Comments" }}>
                {({ navigation }) => <PostScreen postId={selectedPost} navigation={navigation} />}
            </Stack.Screen>

            <Stack.Screen name="AddComment" options={{ title: "Add Comment" }}>
                {({ navigation }) => (
                    <CommentScreen postId={selectedPostForComment} navigation={navigation} />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
