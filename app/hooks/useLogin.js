const snoowrap = require("snoowrap");
import { useState, useEffect } from "react";
import * as Linking from "expo-linking";
import getHeaders from "../API/utils/get-headers";

// Constants
import constants from "../utils/constants";

// Utils
import { setSecureData } from "../utils/storage";
import generateRandomString from "../utils/generate-random-string";
import getUserAgent from "../utils/get-user-agent";

// Context
import zustandStore from "../contexts/zustandStore";

const clientId = __DEV__ ? constants.CLIENT_ID_EXPO_DEV : constants.CLIENT_ID_EXPO_BUILD;
const stateVerificationString = generateRandomString(20);
const scope = "history, identity, read, submit, vote";
const redirectUrl = Linking.createURL("/login");

const authUrl = `https://www.reddit.com/api/v1/authorize.compact?client_id=${clientId}&response_type=code&state=${stateVerificationString}&redirect_uri=${redirectUrl}&duration=permanent&scope=${scope}`;

export default function useLogin() {
    const [refreshToken, setRefreshToken] = useState("");

    const { setAccount, setHasAccount, setFinishedLogin, snoo, setSnoo } = zustandStore();

    const doLogin = refreshToken => {
        if (refreshToken) {
            setRefreshToken(refreshToken);
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
        const params = new URLSearchParams();
        params.append("code", code);
        params.append("grant_type", "authorization_code");
        params.append("redirect_uri", redirectUrl);

        fetch("https://www.reddit.com/api/v1/access_token", {
            method: "POST",
            headers: getHeaders(),
            body: params.toString(),
        })
            .then(response => response.json())
            .then(response => {
                const { access_token, refresh_token, expires_in } = response;
                console.log(`Got refresh token: ${refresh_token}`);

                if (refresh_token) {
                    setSecureData(constants.REFRESH_TOKEN, refresh_token);
                    setRefreshToken(refresh_token);
                }
            })
            .catch(erorr => console.log(erorr));
    };

    useEffect(() => {
        if (!refreshToken) return;

        console.log("Creating snoowrap instance with refresh token:", refreshToken);

        const r = new snoowrap({
            userAgent: getUserAgent(),
            clientId: clientId,
            clientSecret: "",
            refreshToken: refreshToken,
        });
        r._nextRequestTimestamp = -1;
        r.getMe().then(me => setAccount(me));
        if (__DEV__) r.config({ debug: true });

        setSnoo(r);
        setFinishedLogin(true);
        setHasAccount(true);
    }, [refreshToken]);

    return { doLogin, handleDeepLink };
}
