import { Text, Pressable, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// Context
import zustandStore from "../contexts/zustandStore";

// Utils
import formatBigNumber from "../utils/format-big-number";

const ICONS_SIZE = 20;
const VOTE_TYPE = {
    UPVOTE: "UPVOTE",
    DOWNVOTE: "DOWNVOTE",
};

export default function VoteComponent({ postData }) {
    const { snoo } = zustandStore();

    const { id, ups: upvotes, downs: downvotes, likes: voted } = postData;

    const scoreDiff = upvotes - downvotes;

    const [voteType, setVoteType] = useState("");
    const [score, setScore] = useState(scoreDiff);

    const handleVoteChange = type => {
        let alreadyVoted = false;

        if (type === VOTE_TYPE.UPVOTE) {
            if (type === voteType) {
                alreadyVoted = true;
            } else {
                setVoteType(VOTE_TYPE.UPVOTE);
                doUpvote();
                setScore(scoreDiff + 1);
            }
        }
        if (type === VOTE_TYPE.DOWNVOTE) {
            if (type === voteType) {
                alreadyVoted = true;
            } else {
                setVoteType(VOTE_TYPE.DOWNVOTE);
                doDownvote();
                setScore(scoreDiff - 1);
            }
        }

        if (alreadyVoted) {
            setVoteType(null);
            doRemoveVote();
            setScore(scoreDiff);
        }
    };

    const doUpvote = () => snoo.getSubmission(id).upvote();
    const doDownvote = () => snoo.getSubmission(id).downvote();
    const doRemoveVote = () => snoo.getSubmission(id).unvote();

    useEffect(() => {
        switch (voted) {
            case true:
                setVoteType(VOTE_TYPE.UPVOTE);
                break;
            case false:
                setVoteType(VOTE_TYPE.DOWNVOTE);
                break;
            default:
                setVoteType(null);
                break;
        }
    }, []);

    return (
        <View style={styles.container}>
            <Pressable onPress={() => handleVoteChange(VOTE_TYPE.UPVOTE)}>
                <FontAwesomeIcon
                    icon={faArrowUp}
                    size={ICONS_SIZE}
                    color={voteType === VOTE_TYPE.UPVOTE ? "#30BA00" : "black"}
                />
            </Pressable>

            <Text style={styles.score}>{formatBigNumber(score)}</Text>

            <Pressable onPress={() => handleVoteChange(VOTE_TYPE.DOWNVOTE)}>
                <FontAwesomeIcon
                    icon={faArrowDown}
                    size={ICONS_SIZE}
                    color={voteType === VOTE_TYPE.DOWNVOTE ? "red" : "black"}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        alignSelf: "flex-end",
        flexDirection: "row",
        alignItems: "center",
    },
    score: {
        fontSize: 15,
        marginHorizontal: 7,
    },
});

VoteComponent.defaultProps = {
    upvotes: 0,
    downvotes: 0,
};
