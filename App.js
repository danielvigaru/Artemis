// Dependency fixes
import { decode, encode } from "base-64";
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

// Contexts
import AccountContext from "./app/contexts/AccountContext";

// Hooks
import useLogin from "./app/hooks/useLogin";

// Utils
import { getSecureData, deleteSecureData, setSecureData } from "./app/utils/storage";
import constants from "./app/utils/constants";
import doUserlessAction from "./app/API/userless/do-userless-action";

// Screens
import FeedScreen from "./app/screens/Feed/FeedScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import SettingsScreen from "./app/screens/SettingsScreen";

const Tab = createBottomTabNavigator();

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
    const [snoo, doLogin] = useLogin();

    const [username, setUsername] = useState("");
    const [hasAccount, setHasAccount] = useState(false);

    const doLogOut = () => {
        deleteSecureData(constants.REFRESH_TOKEN);
        setHasAccount(false);
    };

    useEffect(() => {
        let _hasAccount = false;

        getSecureData(constants.REFRESH_TOKEN) //
            .then(token => {
                if (token) {
                    doLogin(token);
                    _hasAccount = true;
                    setHasAccount(true);
                }
            });

        if (!_hasAccount) {
            // doUserlessAction().then(snoo =>
            //     snoo
            //         .getSubmission("u9llrv")
            //         .fetch()
            //         .then(post => {
            //             console.log(post);
            //         })
            // );
        }
    }, []);

    // useEffect(() => {
    //     if (!snoo) return;

    //     snoo.getMe().then(me => {
    //         setUsername(me.name);
    //         setIsAuthenticated(true);
    //     });
    // }, [snoo]);

    return (
        <AccountContext.Provider
            value={{
                username,
                setUsername,
                isAuthenticated: hasAccount,
                setIsAuthenticated: setHasAccount,
                doLogOut,
            }}
        >
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Feed" component={FeedScreen} />
                    <Tab.Screen name="Profile" component={ProfileScreen} />
                    <Tab.Screen name="Settings" component={SettingsScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        </AccountContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f3f3",
        alignItems: "center",
        justifyContent: "center",
    },
});
