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
import useStore from "./app/contexts/AccountZustand";

// Hooks
import useLogin from "./app/hooks/useLogin";

// Utils
import { getSecureData, deleteSecureData } from "./app/utils/storage";
import constants from "./app/utils/constants";

// Screens
import FeedScreen from "./app/screens/FeedScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import SettingsScreen from "./app/screens/SettingsScreen";

const Tab = createBottomTabNavigator();

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
    const { doLogin } = useLogin();
    const { setHasAccount, setFinishedLogin } = useStore();

    useEffect(() => {
        getSecureData(constants.REFRESH_TOKEN) //
            .then(token => {
                if (token) {
                    console.log("found token in storage");
                    doLogin(token);
                    setHasAccount(true);
                } else {
                    setHasAccount(false);
                    setFinishedLogin(true);
                }
            });
    }, []);

    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Feed" component={FeedScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
