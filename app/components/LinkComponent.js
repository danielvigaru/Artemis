import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";

// Components
import ImageComponent from "./ImageComponent";

export default function LinkComponent({ postData, viewWidth }) {
    const { url, domain, preview } = postData;
    const hasPreview = !!preview;

    return (
        <View>
            {hasPreview && (
                <View style={{ paddingBottom: 20 }}>
                    <ImageComponent postData={postData} viewWidth={viewWidth} />
                </View>
            )}
            <Pressable style={styles.wrapper} onPress={() => Linking.openURL(url)}>
                <Text style={styles.linkIcon}>🔗</Text>
                <Text>{domain}</Text>
            </Pressable>
        </View>
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
