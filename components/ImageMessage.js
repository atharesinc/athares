import React from "reactn";
import {
  StyleSheet,
  View,
  Text,
  // Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncImage from "./AsyncImage";
import MeshAlert from "../utils/meshAlert";

let CameraRoll = null;

if (Platform.OS !== "web") {
  CameraRoll = require("@react-native-community/cameraroll");
}

import { FileSystem } from "expo";

const ImageMessage = ({ file }) => {
  const requestDownload = () => {
    MeshAlert({
      title: "Save Image",
      text: "Do you want to save this file?",
      submitText: "Save",
      onSubmit: download,
      icon: "info",
    });
  };
  const download = async () => {
    if (Platform.OS === "web") {
      let a = document.createElement("a");
      a.href = file;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    try {
      let local = await FileSystem.downloadAsync(
        file,
        FileSystem.documentDirectory + "photos/" + file
      );
      await CameraRoll.saveToCameraRoll(local.uri, "photo");
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <View style={styles.wrapper}>
      {/* <Lightbox
        underlayColor="#3a3e52"
        renderHeader={(close) => (
          <TouchableOpacity onPress={close}>
            <Feather
              color={"#FFFFFF"}
              style={styles.close}
              size={25}
              name={"x"}
            />
          </TouchableOpacity>
        )}
        renderContent={() => (
          <Image
            style={{ flex: 1 }}
            resizeMode="contain"
            source={{ uri: file }}
          />
        )}
      > */}
      <AsyncImage
        source={{ uri: file }}
        style={styles.image}
        placeholderColor={"#3a3e52"}
      />
      {/* </Lightbox> */}
      <TouchableOpacity onPress={requestDownload}>
        <View style={styles.labelTextWrapper}>
          <Text style={styles.labelText} ellipsizeMode={"middle"}>
            {file.split("uploads/")[1]}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ImageMessage;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    marginBottom: 5,
  },
  close: {
    padding: 15,
  },
  image: {
    height: 120,
    width: 120,
    marginBottom: 10,
    backgroundColor: "#2f3242",
  },
  labelTextWrapper: {
    backgroundColor: "#2f3242",
    borderRadius: 4,
    width: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  labelText: {
    color: "#FFFFFF",
    fontSize: 10,
    padding: 5,
    paddingHorizontal: 10,
  },
});
