import { Pressable, StyleSheet, Text } from "react-native";
import * as Linking from "expo-linking";

export default function LinkComponent({ url, displayUrl }) {
    return (
        <Pressable style={styles.wrapper} onPress={() => Linking.openURL(url)}>
            <Text style={styles.linkIcon}>🔗</Text>
            <Text>{displayUrl}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#F0F1F3",
        borderRadius: 10,
        flex: 1,
        flexDirection: "row",
        padding: 20,
    },
    linkIcon: {
        marginRight: 15,
    },
});
