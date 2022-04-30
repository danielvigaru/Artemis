import { StyleSheet, View, FlatList } from "react-native";
import React, { useMemo, useState, useEffect } from "react";

// Context
import accountStore from "../contexts/AccountZustand";

// API
import doUserlessAction from "../API/userless/do-userless-action";

// Components
import CommentComponent from "../components/CommentComponent";
import PostComponent from "../components/PostComponent";

export default function PostScreen({ postId }) {
    const { snoo, hasAccount } = accountStore();

    const [postData, setPostData] = useState({});
    const [comments, setComments] = useState([]);

    const getPostData = async () => {
        if (hasAccount) {
            return await snoo.getSubmission(postId).fetch();
        } else {
            const userless = await doUserlessAction();
            return await userless.getSubmission(postId).fetch();
        }
    };

    useEffect(async () => {
        const postData = await getPostData();
        setPostData(postData);
        setComments(postData.comments);
    }, []);

    const Post = () => {
        return (
            <View>
                <View style={styles.postContainer}>
                    <PostComponent postData={postData} />
                </View>
                <View>
                    {comments.length > 0 &&
                        comments.map(comment => (
                            <CommentComponent key={comment.id} commentData={comment} />
                        ))}
                </View>
            </View>
        );
    };

    return <FlatList ListHeaderComponent={Post} />;
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: "#fbfbfb",
        marginVertical: 5,
        padding: 15,
    },
    text: {
        fontSize: 16,
    },
    subName: {
        marginTop: 5,
        fontSize: 13,
    },
    bold: {
        fontWeight: "bold",
    },
    postContent: {
        marginVertical: 20,
    },
});
