import { FlatList } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";

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

    const Card = ({ item }) => <FeedPost postData={item} visiblePosts={visiblePosts} />;

    return (
        <FlatList
            data={posts}
            keyExtractor={item => item.id}
            onRefresh={fetchPosts}
            onViewableItemsChanged={onViewableItemsChanged}
            ref={flatListRef}
            refreshing={loading}
            renderItem={Card}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
    );
}
