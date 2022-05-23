import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FlatList } from "react-native";
import { useEffect, useRef, useState } from "react";

// Components
import FeedPost from "../components/FeedPost";

// Screens
import CommentScreen from "./CommentScreen";
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
    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });
    const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
        const viewableIds = viewableItems.map(viewable => viewable.item.id);
        setVisiblePosts(viewableIds);
    });

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
            <Stack.Screen name="Feed">
                {({ navigation }) => (
                    <FlatList
                        data={posts.map(post => ({ ...post, navigation }))}
                        keyExtractor={item => item.id}
                        onRefresh={fetchPosts}
                        onViewableItemsChanged={onViewableItemsChanged.current}
                        ref={flatListRef}
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
                {() => <CommentScreen postId={selectedPost} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
