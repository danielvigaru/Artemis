// Utils
import getHeaders from "../utils/get-headers";

export default function getUserlessToken(deviceId) {
    // console.log("deviceId", deviceId);

    const params = new URLSearchParams();
    params.append("grant_type", "https://oauth.reddit.com/grants/installed_client");
    params.append("device_id", deviceId);

    fetch("https://www.reddit.com/api/v1/access_token", {
        method: "POST",
        headers: getHeaders(),
        body: params.toString(),
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => console.log("[ useUserlessAuth ] error:", error));
}
