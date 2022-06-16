import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import * as Linking from "expo-linking";

// Componente
import ImageComponent from "./ImageComponent";

// Constante
import constants from "../utils/constants";

export default function LinkComponent({ postData, viewWidth }) {
    const { url, domain, preview } = postData;
    const hasPreview = !!preview;

    const colorScheme = useColorScheme();

    return (
        <Pressable style={styles.wrapper} onPress={() => Linking.openURL(url)}>
            {hasPreview && (
                <ImageComponent postData={postData} viewWidth={viewWidth} roundedCorners={false} />
            )}

            <View
                style={[styles.linkWrapper, colorScheme === "dark" ? styles.linkWrapperDark : null]}
            >
                <Text style={styles.linkIcon}>🔗</Text>

                <Text
                    style={
                        colorScheme === "dark" ? { color: constants.DARK_THEME_LIGHT_COLOR } : null
                    }
                >
                    {domain}
                </Text>
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
    linkWrapperDark: {
        backgroundColor: "#828384",
    },
    linkIcon: {
        marginRight: 15,
    },
});
