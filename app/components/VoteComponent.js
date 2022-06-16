import { Text, Pressable, View, StyleSheet, useColorScheme } from "react-native";
import { useState, useEffect } from "react";

// Iconite FontAwesome
import { faArrowUp, faArrowDown, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// Constante
import constants from "../utils/constants";

// Context
import zustandStore from "../contexts/zustandStore";

// Utilitare
import formatBigNumber from "../utils/format-big-number";

const ICONS_SIZE = 20;
const VOTE_TYPE = {
    UPVOTE: "UPVOTE",
    DOWNVOTE: "DOWNVOTE",
};

export default function VoteComponent({ postData, doUpvote, doDownvote, doRemoveVote }) {
    const { setSelectedPostForComment, isLeftHandMode } = zustandStore();

    const { id, ups: upvotes, downs: downvotes, likes: voted, navigation } = postData;
    const scoreDiff = upvotes - downvotes || 0;

    const [voteType, setVoteType] = useState("");
    const [score, setScore] = useState(scoreDiff);

    const colorScheme = useColorScheme();

    const handleVoteChange = type => {
        let alreadyVoted = false;

        if (type === VOTE_TYPE.UPVOTE) {
            if (type === voteType) {
                alreadyVoted = true;
            } else {
                doUpvote();
                setVoteType(VOTE_TYPE.UPVOTE);
                setScore(scoreDiff + 1);
            }
        }
        if (type === VOTE_TYPE.DOWNVOTE) {
            if (type === voteType) {
                alreadyVoted = true;
            } else {
                doDownvote();
                setVoteType(VOTE_TYPE.DOWNVOTE);
                setScore(scoreDiff - 1);
            }
        }

        if (alreadyVoted) {
            doRemoveVote();
            setVoteType(null);
            setScore(scoreDiff);
        }
    };

    const openCommentScreen = () => {
        setSelectedPostForComment(id);
        navigation.navigate("AddComment");
    };

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
        <View
            style={[
                styles.container,
                isLeftHandMode && { flexDirection: "row-reverse", alignSelf: "flex-start" },
            ]}
        >
            <Pressable onPress={openCommentScreen}>
                <FontAwesomeIcon
                    icon={faCommentDots}
                    size={ICONS_SIZE}
                    color={colorScheme === "dark" ? constants.DARK_THEME_LIGHT_COLOR : "black"}
                />
            </Pressable>

            <Text
                style={[
                    styles.separator,
                    colorScheme === "dark" && { color: constants.DARK_THEME_LIGHT_COLOR },
                ]}
            >
                |
            </Text>

            <View style={{ flexDirection: "row" }}>
                <Pressable onPress={() => handleVoteChange(VOTE_TYPE.UPVOTE)}>
                    <FontAwesomeIcon
                        icon={faArrowUp}
                        size={ICONS_SIZE}
                        color={
                            voteType === VOTE_TYPE.UPVOTE
                                ? "#30BA00"
                                : colorScheme === "dark"
                                ? constants.DARK_THEME_LIGHT_COLOR
                                : "black"
                        }
                    />
                </Pressable>

                <Text
                    style={[
                        styles.score,
                        colorScheme === "dark" && { color: constants.DARK_THEME_LIGHT_COLOR },
                    ]}
                >
                    {formatBigNumber(score)}
                </Text>

                <Pressable onPress={() => handleVoteChange(VOTE_TYPE.DOWNVOTE)}>
                    <FontAwesomeIcon
                        icon={faArrowDown}
                        size={ICONS_SIZE}
                        color={
                            voteType === VOTE_TYPE.DOWNVOTE
                                ? "red"
                                : colorScheme === "dark"
                                ? constants.DARK_THEME_LIGHT_COLOR
                                : "black"
                        }
                    />
                </Pressable>
            </View>
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
    separator: {
        marginHorizontal: 14,
    },
});
