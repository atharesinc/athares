import React from "reactn";
import { Feather } from "@expo/vector-icons";

import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FileSystem } from "expo";
import MeshAlert from "../utils/meshAlert";

const FileMessage = ({ file, fileName }) => {
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
    try {
      // let local =
      await FileSystem.downloadAsync(
        file,
        FileSystem.documentDirectory + "downloads/" + fileName
      );
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <TouchableOpacity style={styles.wrapper} onPress={requestDownload}>
      <Feather name={"file-text"} color="#FFFFFF" size={20} />
      <Text style={styles.labelText}>{fileName}</Text>
    </TouchableOpacity>
  );
};

export default FileMessage;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "#3a3e52",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    paddingHorizontal: 10,
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
    fontSize: 12,
    marginLeft: 10,
  },
});
