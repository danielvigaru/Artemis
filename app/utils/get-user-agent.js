import { Platform } from "react-native";
import expoConstants from "expo-constants";

export default function getUserAgent() {
    const deviceOS = Platform.OS;
    const bundleId = "com.danielvigaru.artemis";
    const appVersion = expoConstants.manifest.version;
    const userAgent = `${deviceOS}:${bundleId}:${appVersion} (by /u/danielvigaru)`;

    return userAgent;
}
