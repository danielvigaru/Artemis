import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Stocare simpla
const setData = async (key, value) => {
    try {
        const _key = `@${key}`;
        await AsyncStorage.setItem(_key, value);
    } catch (error) {
        console.log("[setData] error: ", error);
    }
};

const getData = async key => {
    try {
        return await AsyncStorage.getItem(`@${key}`);
    } catch (error) {
        console.log("[getData] error: ", error);
    }
};

const deleteData = async key => {
    try {
        return await AsyncStorage.removeItem(`@${key}`);
    } catch (error) {
        console.log("[deleteData] error: ", error);
    }
};

const resetData = async key => {
    try {
        return await AsyncStorage.removeItem(`@${key}`);
    } catch (error) {
        console.log("[resetData] error: ", error);
    }
};

// Stocare securizata
const setSecureData = async (key, value) => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.log("[setSecureData] error: ", error);
    }
};

const getSecureData = async key => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.log("[getSecureData] error: ", error);
    }
};

const deleteSecureData = async key => {
    try {
        return await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.log("[deleteSecureData] error: ", error);
    }
};

export { setData, getData, deleteData, resetData, setSecureData, getSecureData, deleteSecureData };
