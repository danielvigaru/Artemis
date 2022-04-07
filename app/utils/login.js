import snoowrap from "snoowrap";
import { getBundleId, getVersion } from "react-native-device-info";

const userAgent = `${getDeviceOs()}:${getBundleId()}:${getVersion()} (by /u/grasozauru)`;

const snoo = new snoowrap({
    userAgent: userAgent,
    clientId: "put your client id here",
    clientSecret: "put your client secret here",
    refreshToken: "put your refresh token here",
});
