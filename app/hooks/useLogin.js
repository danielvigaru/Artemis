import { Platform } from "react-native";
import { useState, useEffect } from "react";
import * as Linking from "expo-linking";
import base64 from "react-native-base64";
import { default as expoConstants } from "expo-constants";
const snoowrap = require("snoowrap");

// Utils
import { setSecureData } from "../utils/storage";
import constants from "../utils/constants";
import generateRandomString from "../utils/generate-random-string";

const deviceOS = Platform.OS;
const bundleId = "com.grs.artemis";
const appVersion = expoConstants.manifest.version;
const userAgent = `${deviceOS}:${bundleId}:${appVersion} (by /u/danielvigaru)`;

const clientId = "uQz7uT4H2QriApuiwc-G_A";
const stateVerificationString = generateRandomString(20);
const scope = "edit, history, identity, mysubreddits, read, save, submit, subscribe, vote";
const redirectUrl = Linking.createURL("/login");

const authUrl = `https://www.reddit.com/api/v1/authorize.compact?client_id=${clientId}&response_type=code&state=${stateVerificationString}&redirect_uri=${redirectUrl}&duration=permanent&scope=${scope}`;

export default function useLogin() {
    const [snoo, setSnoo] = useState(() => {});
    const [refreshToken, setRefreshToken] = useState("");

    const doLogin = accessToken => {
        if (accessToken) {
            setRefreshToken(accessToken);
        } else {
            Linking.openURL(authUrl);
        }
    };

    const handleDeepLink = ({ url }) => {
        if (!url) return;

        const { error, code, state } = Linking.parse(url).queryParams;

        if (error) console.log("[ handleDeepLink ] error: ", error);
        if (state === stateVerificationString) getTokens(code);
    };

    const getTokens = code => {
        const auth = base64.encode(`${clientId}:`);

        const headers = new Headers();
        headers.append("Authorization", `Basic ${auth}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append("User-Agent", userAgent);

        const params = new URLSearchParams();
        params.append("code", code);
        params.append("grant_type", "authorization_code");
        params.append("redirect_uri", redirectUrl);

        fetch("https://www.reddit.com/api/v1/access_token", {
            method: "POST",
            headers: headers,
            body: params.toString(),
        })
            .then(response => response.json())
            .then(response => {
                const { access_token, refresh_token, expires_in } = response;
                console.log(`Got refresh token: ${refresh_token}`);

                if (refresh_token) setSecureData(constants.REFRESH_TOKEN, refresh_token);
            })
            .catch(erorr => console.log(erorr));
    };

    useEffect(() => {
        if (!clientId || !refreshToken || !userAgent) return;

        const snoo = new snoowrap({
            userAgent: userAgent,
            clientId: clientId,
            clientSecret: "",
            refreshToken: refreshToken,
        });

        setSnoo(snoo);
    }, [clientId, refreshToken, userAgent]);

    return [snoo, doLogin, handleDeepLink];
}
