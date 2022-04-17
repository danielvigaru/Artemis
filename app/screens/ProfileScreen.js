import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, ScrollView, Button } from "react-native";
import * as Linking from "expo-linking";

import AccountContext from "../contexts/AccountContext";
import useLogin from "../hooks/useLogin";

export default function ProfileScreen() {
    const { username, isAuthenticated, doLogOut } = useContext(AccountContext);

    const [snoo, doLogin, handleDeepLink] = useLogin();

    useEffect(() => {
        Linking.addEventListener("url", handleDeepLink);

        return () => {
            Linking.removeEventListener("url", handleDeepLink);
        };
    }, []);

    return (
        <ScrollView>
            {isAuthenticated ? (
                <>
                    <Text>Hi, {username}</Text>
                    <Button title="Log out" onPress={doLogOut} />
                </>
            ) : (
                <>
                    <Button title="Login" onPress={() => doLogin()} />
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
