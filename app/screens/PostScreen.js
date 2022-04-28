import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useMemo, useState, useEffect } from "react";

// Context
import accountStore from "../contexts/AccountZustand";

// Utils
import getSubmissionType from "../utils/get-submission-type";
import truncateText from "../utils/truncate-text";

// Components
import CommentComponent from "../components/CommentComponent";
import ImageComponent from "../components/ImageComponent";
import LinkComponent from "../components/LinkComponent";
import VideoComponent from "../components/VideoComponent";
import VoteComponent from "../components/VoteComponent";

export default function PostScreen({ postId }) {
    const { snoo } = accountStore();

    const [viewWidth, setViewWidth] = useState(-1);
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);

    const contentType = useMemo(() => getSubmissionType(post), [post]);

    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setViewWidth(width);
    };

    const getPostData = async () => {
        const post = snoo.getSubmission(postId).fetch();
        return post;
    };

    useEffect(async () => {
        const postData = await getPostData();
        setPost(postData);
        setComments(postData.comments);
    }, []);

    const Post = () => {
        return (
            <View>
                <View style={styles.postContainer}>
                    <Text style={[styles.text, styles.bold]}>{post.title}</Text>
                    <Text style={styles.subName}>{post.subreddit_name_prefixed}</Text>

                    <View style={styles.postContent} onLayout={onLayout}>
                        {contentType === "selftext" && (
                            <Text>{truncateText(post.selftext, 150)}</Text>
                        )}

                        {contentType === "image" && (
                            <ImageComponent postData={post} viewWidth={viewWidth} />
                        )}

                        {(contentType === "video" || contentType === "gif") && (
                            <VideoComponent
                                postData={post}
                                isVideo={contentType === "video"}
                                viewWidth={viewWidth}
                            />
                        )}

                        {(contentType === "link" || contentType === "link-with-preview") && (
                            <LinkComponent postData={post} viewWidth={viewWidth} />
                        )}
                    </View>

                    <VoteComponent
                        upvotes={post.ups}
                        doUpvote={() => post.upvote()}
                        downvotes={post.downs}
                        doDownvote={() => post.downvote()}
                        voted={post.likes}
                        doRemoveVote={() => post.unvote()}
                    />
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
