// Dependency fixes
import { decode, encode } from "base-64";
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

// Fontawesome icons
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faRedditAlien } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import * as Font from "expo-font";

// Contexts
import zustandStore from "./app/contexts/zustandStore";

// Hooks
import useLogin from "./app/hooks/useLogin";

// Utils
import { getSecureData } from "./app/utils/storage";
import constants from "./app/utils/constants";

// Screens
import FeedScreen from "./app/screens/FeedScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import SettingsScreen from "./app/screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["Unhandled rejection Error"]);

export default function App() {
    const { doLogin } = useLogin();
    const { setHasAccount, setFinishedLogin } = zustandStore();

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

        loadFonts();
    }, []);

    return (
        <NavigationContainer>
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
                                color={focused ? "#F84505" : "#505D74"}
                            />
                        );
                    },
                    tabBarActiveTintColor: "#F84505",
                    tabBarInactiveTintColor: "#505D74",
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
