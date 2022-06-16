import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, Text, View, useColorScheme, Switch } from "react-native";
import React, { useState, useEffect } from "react";

// Constante
import constants from "../utils/constants";

// Context
import zustandStore from "../contexts/zustandStore";

// Stocare
import { setData } from "../utils/storage";

export default function Settings() {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState([]);

    const { commentsColorPallete, setCommentsColorPallete, isLeftHandMode, setIsLeftHandMode } =
        zustandStore();

    const colorScheme = useColorScheme();

    const renderLabel = () => {
        if (!(value || isFocus)) return null;

        return (
            <Text
                style={[
                    styles.label,
                    colorScheme === "dark"
                        ? {
                              backgroundColor: "#46474A",
                              color: constants.DARK_THEME_LIGHT_COLOR,
                          }
                        : null,
                    isFocus && { color: constants.REDDIT_COLOR },
                ]}
            >
                Choose comment color pallete
            </Text>
        );
    };

    const onPalleteChange = item => {
        const { value } = item;

        setValue(value);
        setIsFocus(false);
        setCommentsColorPallete(value);
        setData(constants.COMMENTS_PALLETE, JSON.stringify(value));
    };

    const onLeftHandModeChange = () => {
        const _isLeftHandMode = !isLeftHandMode;

        setIsLeftHandMode(_isLeftHandMode);
        setData(constants.LEFT_HAND_MODE, JSON.stringify(_isLeftHandMode));
    };

    useEffect(() => {
        let options = [];

        constants.COMMENTS_COLOR_PALLETES.map((pallete, index) => {
            options.push({
                label: `Pallete ${index + 1}`,
                value: pallete,
            });
        });

        setDropdownOptions(options);
    }, []);

    useEffect(() => {
        setValue(commentsColorPallete);
    }, []);

    return (
        <View>
            <View
                style={[
                    styles.container,
                    colorScheme === "dark" ? { backgroundColor: "#46474A" } : null,
                ]}
            >
                {renderLabel()}
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: constants.REDDIT_COLOR }]}
                    containerStyle={
                        colorScheme === "dark" && {
                            backgroundColor: "#46474A",
                        }
                    }
                    activeColor={colorScheme === "dark" ? "#888A90" : undefined}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={[
                        styles.selectedTextStyle,
                        colorScheme === "dark" && {
                            color: constants.DARK_THEME_LIGHT_COLOR,
                        },
                    ]}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={dropdownOptions}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? "Comments color pallete" : "..."}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={onPalleteChange}
                />
            </View>

            <View
                style={[
                    styles.container,
                    { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
                    colorScheme === "dark" && { backgroundColor: "#46474A" },
                ]}
            >
                <Text
                    style={[
                        { marginStart: 5 },
                        colorScheme === "dark" && { color: constants.DARK_THEME_LIGHT_COLOR },
                    ]}
                >
                    Left Hand Mode
                </Text>

                <Switch
                    trackColor="#81b0ff"
                    onValueChange={onLeftHandModeChange}
                    value={isLeftHandMode}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    label: {
        position: "absolute",
        backgroundColor: "white",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
