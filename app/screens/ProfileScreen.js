import React, { useContext, useState } from "react";
import { StyleSheet, Text, ScrollView, Button } from "react-native";

import AccountContext from "../contexts/AccountContext";
import LoginModal from "../components/LoginModal";

export default function ProfileScreen() {
    const [modalOpen, setModalOpen] = useState(false);

    const { username, isAuthenticated, doLogOut } = useContext(AccountContext);

    return (
        <ScrollView>
            {isAuthenticated ? (
                <>
                    <Text>Hi, {username}</Text>
                    <Button title="Log out" onPress={doLogOut} />
                </>
            ) : (
                <>
                    <Button title="Login" onPress={() => setModalOpen(true)} />
                    <LoginModal open={modalOpen} setOpen={setModalOpen} />
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
