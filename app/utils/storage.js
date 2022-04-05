import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Normal storage
const setData = async (key, value) => {
    try {
        const _key = `@${key}`;
        await AsyncStorage.setItem(_key, value);
    } catch (e) {
        console.log("[storeData] error: ", e);
    }
};

const getData = async key => {
    try {
        return await AsyncStorage.getItem(`@${key}`);
    } catch (e) {
        console.log("[getData] error: ", e);
    }
};

const deleteData = async key => {
    try {
        return await AsyncStorage.removeItem(`@${key}`);
    } catch (e) {
        console.log("[deleteData] error: ", e);
    }
};

const resetData = async key => {
    try {
        return await AsyncStorage.removeItem(`@${key}`);
    } catch (e) {
        console.log("[resetData] error: ", e);
    }
};

// Secured Storage
const setSecureData = async (key, value) => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (e) {
        console.log("[storeSecureData] error: ", e);
    }
};

const getSecureData = async key => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (e) {
        console.log("[getSecureData] error: ", e);
    }
};

const deleteSecureData = async key => {
    try {
        return await SecureStore.deleteItemAsync(key);
    } catch (e) {
        console.log("[deleteSecureData] error: ", e);
    }
};

export { setData, getData, deleteData, resetData, setSecureData, getSecureData, deleteSecureData };
