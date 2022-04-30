import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FlatList } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";

// Components
import FeedPost from "../components/FeedPost";

// Screens
import PostScreen from "./PostScreen";

// Context
import zustandStore from "../contexts/zustandStore";

// API
import doUserlessAction from "../API/userless/do-userless-action";

const Stack = createNativeStackNavigator();

export default function FeedScreen() {
    const { snoo, hasAccount, finishedLogin, selectedPost, setVisiblePosts } = zustandStore();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const flatListRef = useRef();

    const fetchPosts = () => {
        setLoading(true);

        if (hasAccount) {
            snoo.getBest()
                .then(posts => setPosts(posts))
                .finally(() => setLoading(false));
        } else {
            doUserlessAction()
                .then(resp => resp.getBest())
                .then(posts => setPosts(posts))
                .finally(() => setLoading(false));
        }
    };

    const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        const viewableIds = viewableItems.map(viewable => viewable.item.id);
        setVisiblePosts(viewableIds);
    }, []);

    useEffect(() => {
        if (!finishedLogin) return;
        fetchPosts();

        if (posts.length) {
            flatListRef.current.scrollToIndex({ index: 0 });
        }
    }, [finishedLogin, hasAccount, snoo]);

    const Card = ({ item }) => <FeedPost postData={item} navigation={item.navigation} />;

    return (
        <Stack.Navigator>
            <Stack.Screen name="PostList" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <FlatList
                        data={posts.map(post => ({ ...post, navigation }))}
                        keyExtractor={item => item.id}
                        onRefresh={fetchPosts}
                        onViewableItemsChanged={onViewableItemsChanged}
                        ref={flatListRef}
                        refreshing={loading}
                        renderItem={Card}
                        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="PostDetails" options={{ headerShown: false }}>
                {() => <PostScreen posts={posts} postId={selectedPost} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
