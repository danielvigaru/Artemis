import React, { useState, useEffect, useContext } from "react";
import { Modal, StyleSheet, Text, Pressable, View, TextInput } from "react-native";

import constants from "../utils/constants";
import { setSecureData } from "../utils/storage";
import AccountContext from "../contexts/AccountContext";

export default function LoginModal({ open, setOpen }) {
    const { setIsAuthenticated, username, setUsername, password, setPassword } = useContext(AccountContext);

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    const onLoginClick = () => {
        setUsername(user);
        setPassword(pass);
        setSecureData(constants.USERNAME_KEY, user);
        setSecureData(constants.PASSWORD_KEY, pass);
        setOpen(false);
        setIsAuthenticated(true);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={open} onRequestClose={() => setOpen(false)}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Log in with your Reddit account</Text>

                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="default"
                        onChangeText={setUser}
                        placeholder="username"
                        spellCheck={false}
                        style={[styles.input, styles.inputUsername]}
                        value={user}
                    />

                    <TextInput
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect={false}
                        keyboardType="default"
                        onChangeText={setPass}
                        placeholder="password"
                        secureTextEntry={true}
                        style={[styles.input, styles.inputUsername]}
                        value={pass}
                    />

                    <View style={styles.buttonsContainer}>
                        <Pressable style={[styles.button, styles.buttonCancel]} onPress={() => setOpen(false)}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>

                        <Pressable style={[styles.button, styles.buttonOk]} onPress={onLoginClick}>
                            <Text style={styles.textStyle}>Log in</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "space-around",

        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#BCBCBC",
        borderRadius: 20,
        marginBottom: 15,
        width: 200,
        textAlign: "center",
    },
    buttonsContainer: {
        flexDirection: "row",
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    buttonOk: {
        backgroundColor: "#2196F3",
        marginLeft: 10,
    },
    buttonCancel: {
        backgroundColor: "#8D8E8F",
        marginRight: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
});
