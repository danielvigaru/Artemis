import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";

// Components
import ImageComponent from "./ImageComponent";

export default function LinkComponent({ postData, viewWidth }) {
    const { url, domain, preview } = postData;
    const hasPreview = !!preview;

    return (
        <Pressable style={styles.wrapper} onPress={() => Linking.openURL(url)}>
            {hasPreview && <ImageComponent postData={postData} viewWidth={viewWidth} />}

            <View style={styles.linkWrapper}>
                <Text style={styles.linkIcon}>🔗</Text>

                <Text>{domain}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 10,
        overflow: "hidden",
    },
    linkWrapper: {
        backgroundColor: "#F0F1F3",
        flex: 1,
        flexDirection: "row",
        padding: 20,
    },
    linkIcon: {
        marginRight: 15,
    },
});
