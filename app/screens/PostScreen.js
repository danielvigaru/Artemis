import { StyleSheet, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";

// Context
import zustandStore from "../contexts/zustandStore";

// API
import doUserlessAction from "../API/userless/do-userless-action";

// Componente
import CommentComponent from "../components/CommentComponent";
import PostComponent from "../components/PostComponent";

export default function PostScreen({ postId, navigation }) {
    const { snoo, hasAccount } = zustandStore();

    const [postData, setPostData] = useState({});
    const [comments, setComments] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const getPostData = async () => {
        if (hasAccount) {
            return await snoo.getSubmission(postId).fetch();
        } else {
            const userless = await doUserlessAction();
            return await userless.getSubmission(postId).fetch();
        }
    };

    const getRefreshedPostData = async () => {
        if (hasAccount) {
            return await snoo.getSubmission(postId).refresh();
        } else {
            const userless = await doUserlessAction();
            return await userless.getSubmission(postId).refresh();
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        getRefreshedPostData()
            .then(postData => {
                setPostData(postData);
                setComments(postData.comments);
            })
            .finally(() => {
                setRefreshing(false);
            });
    };

    useEffect(async () => {
        const postData = await getPostData();
        setPostData(postData);
        setComments(postData.comments);
    }, []);

    const Post = () => {
        return (
            <View style={styles.postContainer}>
                <PostComponent postData={{ ...postData, navigation }} isPostScreen={true} />
            </View>
        );
    };

    return (
        <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListHeaderComponent={Post}
            data={comments}
            renderItem={({ item }) => (
                <CommentComponent key={item.id} commentData={item} navigation={navigation} />
            )}
        />
    );
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: "#fbfbfb",
        marginVertical: 5,
    },
});
