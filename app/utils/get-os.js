import { getManufacturer, getBaseOs } from "react-native-device-info";

export default function getDeviceOs() {
    let os;

    if (getManufacturer() === "Apple") os = "ios";
    if (getBaseOs() === "Android") os = "android";

    return os;
}
