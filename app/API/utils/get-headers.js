import { encode } from "base-64";
import constants from "../../utils/constants";
import getUserAgent from "../../utils/get-user-agent";

export default function getHeaders() {
    const clientId = __DEV__ ? constants.CLIENT_ID_EXPO_DEV : constants.CLIENT_ID_EXPO_BUILD;

    const auth = encode(`${clientId}:`);
    const userAgent = getUserAgent();

    const headers = new Headers();
    headers.append("Authorization", `Basic ${auth}`);
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("User-Agent", userAgent);

    return headers;
}
