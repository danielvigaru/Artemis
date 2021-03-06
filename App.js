import { decode, encode } from "base-64";
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

// Iconite Fontawesome
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faRedditAlien } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import * as Font from "expo-font";

// Context
import zustandStore from "./app/contexts/zustandStore";

// Constante
import constants from "./app/utils/constants";

// Hooks
import useLogin from "./app/hooks/useLogin";

// Utilitare
import { getData, getSecureData } from "./app/utils/storage";

// Ecrane
import FeedScreen from "./app/screens/FeedScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import SettingsScreen from "./app/screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const DARK_THEME = {
    dark: true,
    colors: {
        primary: constants.REDDIT_COLOR,
        background: "#2E282A",
        card: "#46474A",
        text: constants.DARK_THEME_LIGHT_COLOR,
        border: "rgb(199, 199, 204)",
        notification: "#46474A",
    },
};

export default function App() {
    const { doLogin } = useLogin();
    const { setHasAccount, setFinishedLogin, setCommentsColorPallete, setIsLeftHandMode } =
        zustandStore();

    const colorScheme = useColorScheme();

    const loadFonts = async () => {
        await Font.loadAsync({
            "JetBrains Mono": require("./app/assets/fonts/JetBrainsMono-VariableFont_wght.ttf"),
        });
    };

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

        getData(constants.COMMENTS_PALLETE) //
            .then(pallete => {
                if (pallete) {
                    setCommentsColorPallete(JSON.parse(pallete));
                }
            });

        getData(constants.LEFT_HAND_MODE) //
            .then(isLeftHandMode => {
                if (isLeftHandMode) {
                    setIsLeftHandMode(JSON.parse(isLeftHandMode));
                }
            });

        loadFonts();
    }, []);

    return (
        <NavigationContainer theme={colorScheme === "dark" ? DARK_THEME : undefined}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                        let iconName;

                        switch (route.name) {
                            case "FeedScreen":
                                iconName = faRedditAlien;
                                break;
                            case "ProfileScreen":
                                iconName = faAddressCard;
                                break;
                            case "SettingsScreen":
                                iconName = faGear;
                                break;

                            default:
                                break;
                        }

                        return (
                            <FontAwesomeIcon
                                icon={iconName}
                                size={25}
                                color={
                                    focused
                                        ? constants.REDDIT_COLOR
                                        : colorScheme === "dark"
                                        ? constants.DARK_THEME_LIGHT_COLOR
                                        : "#505D74"
                                }
                            />
                        );
                    },
                    tabBarActiveTintColor: constants.REDDIT_COLOR,
                    tabBarInactiveTintColor:
                        colorScheme === "dark" ? constants.DARK_THEME_LIGHT_COLOR : "#505D74",
                })}
            >
                <Tab.Screen
                    name="FeedScreen"
                    component={FeedScreen}
                    options={{ headerShown: false, title: "Feed" }}
                />
                <Tab.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                    options={{ headerShown: false, title: "Profile" }}
                />
                <Tab.Screen
                    name="SettingsScreen"
                    component={SettingsScreen}
                    options={{ title: "Settings" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
