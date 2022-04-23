import { encode } from "base-64";
import constants from "../../utils/constants";
import getUserAgent from "../../utils/get-user-agent";

const auth = encode(`${constants.CLIENT_ID}:`);
const userAgent = getUserAgent();

export default function getHeaders() {
    const headers = new Headers();
    headers.append("Authorization", `Basic ${auth}`);
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("User-Agent", userAgent);

    return headers;
}
