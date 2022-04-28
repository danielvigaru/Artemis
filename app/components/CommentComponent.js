import { Text, View, StyleSheet } from "react-native";

// Context
import accountStore from "../contexts/AccountZustand";

// Components
import VoteComponent from "./VoteComponent";

export default function CommentComponent({ commentData }) {
    const { author, body, id, replies, ups, downs, likes } = commentData;

    const { snoo } = accountStore();

    return (
        <View style={styles.commsContainer}>
            <Text style={[styles.text, styles.author]}>{author.name}</Text>
            <Text>{body}</Text>
            <View style={styles.actionBar}>
                <VoteComponent
                    upvotes={ups}
                    downvotes={downs}
                    doUpvote={() => snoo.getComment(id).upvote()}
                    doDownvote={() => snoo.getComment(id).downvote()}
                    voted={likes}
                    doRemoveVote={() => snoo.getComment(id).unvote()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    commsContainer: {
        backgroundColor: "#fbfbfb",
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginVertical: 5,
    },
    text: {
        marginVertical: 5,
    },
    author: {
        fontWeight: "bold",
    },
    actionBar: {
        marginVertical: 7,
    },
});
