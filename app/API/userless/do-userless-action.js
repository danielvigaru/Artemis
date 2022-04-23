const snoowrap = require("snoowrap");

// Constants
import constants from "../../utils/constants";

// Utils
import { getSecureData, setSecureData } from "../../utils/storage";
import generateRandomString from "../../utils/generate-random-string";
import getUserAgent from "../../utils/get-user-agent";

export default async function doUserlessAction() {
    let deviceId = "";

    const id = await getSecureData(constants.DEVICE_ID);

    if (id) {
        deviceId = id;
    } else {
        const newId = generateRandomString(30);
        deviceId = newId;
        setSecureData(constants.DEVICE_ID, newId);
    }

    try {
        return await snoowrap.fromApplicationOnlyAuth({
            clientId: constants.CLIENT_ID,
            deviceId: deviceId,
            permanent: false,
            userAgent: getUserAgent(),
        });
    } catch (error) {
        return console.log(error);
    }
}
