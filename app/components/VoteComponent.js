import { Text, Pressable, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// Utils
import formatBigNumber from "../utils/format-big-number";

const ICONS_SIZE = 20;

export default function VoteComponent({
    upvotes,
    doUpvote,
    downvotes,
    doDownvote,
    voted,
    doRemoveVote,
}) {
    const scoreDiff = upvotes - downvotes;

    const [voteType, setVoteType] = useState("");
    const [score, setScore] = useState(scoreDiff);

    const handleVoteChange = type => {
        let alreadyVoted = false;

        if (type === "up") {
            if (type === voteType) {
                alreadyVoted = true;
            } else {
                setVoteType("up");
                doUpvote();
                setScore(scoreDiff + 1);
            }
        }
        if (type === "down") {
            if (type === voteType) {
                alreadyVoted = true;
            } else {
                setVoteType("down");
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

    useEffect(() => {
        switch (voted) {
            case true:
                setVoteType("up");
                break;
            case false:
                setVoteType("down");
                break;
            default:
                setVoteType(null);
                break;
        }
    }, []);

    return (
        <View style={styles.container}>
            <Pressable onPress={() => handleVoteChange("up")}>
                <FontAwesomeIcon
                    icon={faArrowUp}
                    size={ICONS_SIZE}
                    color={voteType === "up" ? "#30BA00" : "black"}
                />
            </Pressable>

            <Text style={styles.score}>{formatBigNumber(score)}</Text>

            <Pressable onPress={() => handleVoteChange("down")}>
                <FontAwesomeIcon
                    icon={faArrowDown}
                    size={ICONS_SIZE}
                    color={voteType === "down" ? "red" : "black"}
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
