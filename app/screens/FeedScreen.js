import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import AccountContext from "../contexts/AccountContext";

export default function FeedScreen() {
    const { isAuthenticated } = useContext(AccountContext);

    return (
        <View>
            <Text>Logged in: {isAuthenticated ? "Yep" : "Nope"}</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
