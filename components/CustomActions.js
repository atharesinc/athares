import React from "reactn";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard,
  Platform,
} from "react-native";

import {
  pickFileURIAsync,
  pickImageURIAsync,
  takePictureAsync,
} from "../utils/mediaUtils";
import { Feather } from "@expo/vector-icons";

export default function CustomActions({
  containerStyle = {},
  wrapperStyle = {},
  iconTextStyle = {},
  ...props
}) {
  const getImageUri = async () => {
    try {
      Keyboard.dismiss();
      let uri = await pickImageURIAsync();

      props.updateFile(uri);
    } catch (e) {
      console.error(new Error(e));
    }
  };

  const getPhoto = async () => {
    try {
      Keyboard.dismiss();
      let uri = await takePictureAsync();
      props.updateFile(uri);
    } catch (e) {
      console.error(new Error(e));
    }
  };

  const getFileUri = async () => {
    try {
      Keyboard.dismiss();
      let uri = await pickFileURIAsync();

      props.updateFile(uri);
    } catch (e) {
      console.error(new Error(e));
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[styles.wrapper, wrapperStyle]}
        onPress={getImageUri}
      >
        <Feather
          name="image"
          size={20}
          color={"#FFFFFF"}
          style={[iconTextStyle]}
        />
      </TouchableOpacity>
      {Platform.OS !== "web" && (
        <TouchableOpacity
          style={[styles.wrapper, wrapperStyle]}
          onPress={getPhoto}
        >
          <Feather
            name="camera"
            size={20}
            color={"#FFFFFF"}
            style={[iconTextStyle]}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.wrapper, wrapperStyle]}
        onPress={getFileUri}
      >
        <Feather
          name="paperclip"
          size={20}
          color={"#FFFFFF"}
          style={[iconTextStyle]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#2f3242",
    marginLeft: 10,
  },
  wrapper: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
});
