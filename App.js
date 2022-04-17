import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";

// Contexts
import AccountContext from "./app/contexts/AccountContext";

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

export default function App() {
    const [snoo, doLogin] = useLogin();

    const [username, setUsername] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const doLogOut = () => {
        deleteSecureData(constants.REFRESH_TOKEN);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        getSecureData(constants.REFRESH_TOKEN) //
            .then(token => {
                if (token) doLogin(token);
            });
    }, []);

    return (
        <AccountContext.Provider
            value={{
                username,
                setUsername,
                isAuthenticated,
                setIsAuthenticated,
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
