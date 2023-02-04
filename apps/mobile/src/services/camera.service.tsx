import { Camera } from "react-native-vision-camera";
import { Logger } from "./logger.service";

const logger = new Logger("Camera");

/**
 * Check camera permission, request camera permission if haven't asked before
 *
 * @returns boolean - permission resolved status
 */
export const CheckCameraPermission = async (): Promise<boolean> => {
  const permission = await Camera.getCameraPermissionStatus();
  logger.log(`Initial permission is ${permission}`);

  if (permission === "authorized") {
    return true;
  }

  if (permission === "not-determined") {
    const newPermission = await Camera.requestCameraPermission();
    logger.log(`New permission is ${newPermission}`);

    if (newPermission === "authorized") {
      return true;
    }
  }

  // permission is denied or in restricted mode
  // TODO: use RN linking API to redirect user to settings page to enable camera permission
  return false;
};
