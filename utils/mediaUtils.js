import * as Permissions from "expo-permissions";
// import { Location } from 'expo-location';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
// import Constants from "expo-constants";

import { Linking, Platform } from "react-native";
import MeshAlert from "./meshAlert";

export default async function getPermissionAsync(permission) {
  const { status } = await Permissions.askAsync(permission);
  if (status !== "granted") {
    // const { name } = Constants.manifest;
    const permissionName = permission.toLowerCase().replace("_", " ");
    MeshAlert({
      title: "Cannot be done 😞",
      text: `If you would like to use this feature, you'll need to enable the ${permissionName} permission in your phone settings.`,
      submitText: "Let's go!",
      onSubmit: () => Linking.openURL("app-settings:"),
      icon: "warning",
    });

    return false;
  }
  return true;
}

// export async function getLocationAsync(onSend) {
//   if (await getPermissionAsync(Permissions.LOCATION)) {
//     const location = await Location.getCurrentPositionAsync({});
//     if (location) {
//       onSend([{ location: location.coords }]);
//     }
//   }
// }

export async function pickImageAsync() {
  if (await getPermissionAsync(Permissions.CAMERA_ROLL)) {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: "All",
    });

    if (!result.cancelled) {
      return result;
    }
  }
}

export async function pickFileAsync() {
  if (await getPermissionAsync(Permissions.CAMERA_ROLL)) {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

    if (!result.cancelled) {
      return result;
    }
  }
}

export async function takePictureAsync() {
  if (await getPermissionAsync(Permissions.CAMERA)) {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      // aspect: [4, 3]
    });

    if (!result.cancelled) {
      return result.uri;
    }
  }
}

// Image Picker if we just want the image URI
export async function pickImageURIAsync() {
  if (
    Platform.OS === "web" ||
    (await getPermissionAsync(Permissions.CAMERA_ROLL))
  ) {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      return result.uri;
    }
  }
}

export async function pickFileURIAsync() {
  if (
    Platform.OS === "web" ||
    (await getPermissionAsync(Permissions.CAMERA_ROLL))
  ) {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    // result looks like this:
    /*
      {"type":"success",
      "uri": <superlong base64 unless its way too long>,
      "name":"Solved.zip",
      "file":{},
      "lastModified":1597707891895,
      "size":102620,
      "output":{"0":{}}}
    */
    if (result.size / 1000 / 1000 > 50) {
      throw "Cannot upload file larger than 50MB";
    }

    if (!result.cancelled) {
      return result.uri;
    }
  }
}
