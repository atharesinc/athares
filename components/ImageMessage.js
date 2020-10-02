import React from "reactn";
import {
  StyleSheet,
  View,
  Text,
  // Image,
  TouchableOpacity,
  Alert,
  CameraRoll,
} from "react-native";
import AsyncImage from "./AsyncImage";
// import Lightbox from "react-native-lightbox";
// import { Feather } from "@expo/vector-icons";

import { FileSystem } from "expo";

const ImageMessage = ({ file }) => {
  const requestDownload = () => {
    Alert.alert(
      "Save Image",
      "Do you want to save this file?",
      [
        {
          text: "Save",
          onPress: () => download(),
        },
        { text: "Cancel", onPress: () => {}, style: "cancel" },
      ],
      { cancelable: true }
    );
  };
  const download = async () => {
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
    // resizeMode: "cover",
    marginBottom: 10,
    backgroundColor: "#2f3242",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  labelTextWrapper: {
    backgroundColor: "#2f3242",
    borderRadius: 4,
    width: "fit-content",
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
