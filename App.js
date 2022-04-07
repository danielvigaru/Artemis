import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";

// Contexts
import AccountContext from "./app/contexts/AccountContext";

// Utils
import getDeviceOs from "./app/utils/get-os";

import { getSecureData, deleteSecureData } from "./app/utils/storage";
import constants from "./app/utils/constants";

// Screens
import FeedScreen from "./app/screens/FeedScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import SettingsScreen from "./app/screens/SettingsScreen";

export default function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userAgent, setUserAgent] = useState("");

    const Tab = createBottomTabNavigator();

    const doLogOut = () => {
        deleteSecureData(constants.USERNAME_KEY);
        deleteSecureData(constants.PASSWORD_KEY);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        setUserAgent(`${getDeviceOs()}:${getBundleId()}:${getVersion()} (by /u/grasozauru)`);

        getSecureData(constants.USERNAME_KEY) //
            .then(username => setUsername(username));

        getSecureData(constants.PASSWORD_KEY) //
            .then(password => setPassword(password));
    }, []);

    useEffect(() => {
        if (username && password) {
            setIsAuthenticated(true);
        }
    }, [username, password]);

    return (
        <AccountContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                username,
                setUsername,
                password,
                setPassword,
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
