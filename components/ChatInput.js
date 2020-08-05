import React, { useState } from "reactn";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import Loader from "./Loader";
import { Feather } from "@expo/vector-icons";
import CustomActions from "./CustomActions";
import { AutoGrowTextInput } from "react-native-auto-grow-textinput";

export default function ChatInput(props) {
  const [input, setInput] = useState("");
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [file, setFile] = useState(null);
  const [fileIsImage, setFileIsImage] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [rotate, setRotate] = useState(0);
  const [extension, setExtension] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const submit = () => {
    // send the message to parent
    props.onSend(input, file);
    setInput("");
    setShowFilePreview(false);
    setFile(null);
    setFileIsImage(false);
    setLoadingImage(false);
  };

  const updateFile = async (file) => {
    if (!file || !file.uri) {
      return false;
    }
    file.name =
      file.name ||
      file.uri.substring(file.uri.lastIndexOf("/") + 1, file.uri.length);
    const imgs = ["gif", "png", "jpg", "jpeg", "bmp"];
    let extension = file.uri.match(/\.(.{1,4})$/i);

    if (!extension) {
      setShowFilePreview(true);
      setFile(file);
      setFileIsImage(false);
      return;
    }
    if (imgs.indexOf(extension[1].toLowerCase()) !== -1) {
      setShowFilePreview(true);
      setFile(file);
      setFileIsImage(true);
      return;
    }
    setShowFilePreview(true);
    setFile(file);
    setFileIsImage(false);
  };

  const deleteImage = () => {
    setShowFilePreview(false);
    setFile(null);
    setFileIsImage(false);
  };

  const shouldRenderImage = () => {
    if (fileIsImage) {
      if (loadingImage) {
        return <Loader size={20} style={{ flex: 0 }} />;
      }
      return <Image style={styles.previewImage} source={{ uri: file.uri }} />;
    } else {
      return <Feather name="file-text" color={"#FFFFFFb7"} size={20} />;
    }
  };

  const shouldRenderSendButton = () => {
    if (input !== "" || file !== null) {
      return (
        <TouchableOpacity onPress={submit} style={styles.sendContainer}>
          <Feather name="send" size={20} color={"#FFFFFF"} />
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.sendContainer}>
          <Feather name="send" size={20} color={"transparent"} />
        </View>
      );
    }
  };

  const focusUp = (e) => {
    setIsFocused(true);
  };
  const focusOff = (e) => {
    setIsFocused(false);
  };

  return (
    <View style={styles.wrapper}>
      {/* message is sending */}
      {props.uploadInProgress && (
        <View style={styles.uploadingWrapper}>
          <Loader size={10} style={{ flex: 0, marginRight: 15 }} />
          <Text style={styles.sendingText}>Sending</Text>
        </View>
      )}
      {/* file preview */}
      {file && (
        <View style={styles.filePreviewWrapper}>
          {showFilePreview ? shouldRenderImage() : null}
          <Text style={styles.sendingText} ellipsizeMode={"middle"}>
            {file.name}
          </Text>

          <TouchableOpacity onPress={deleteImage}>
            <Feather name="x" color={"#FFFFFFb7"} size={20} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.composerContainer}>
        <View style={{ alignItems: "stretch", flexGrow: 1, flex: 1 }}>
          <AutoGrowTextInput
            value={input}
            style={[styles.composerInput, isFocused ? styles.focus : {}]}
            onChangeText={setInput}
            placeholder={"Enter Message"}
            multiline={true}
            onSubmitEditing={Keyboard.dismiss}
            placeholderTextColor={"#FFFFFFb7"}
            onFocus={focusUp}
            onBlur={focusOff}
            autoFocus={true}
          />
          <CustomActions updateFile={updateFile} />
        </View>
        {shouldRenderSendButton()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: 3,
  },
  filePreviewWrapper: {
    backgroundColor: "#2f3242",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  previewImage: {
    height: 50,
    width: 80,
    resizeMode: "cover",
  },
  uploadingWrapper: {
    backgroundColor: "#2f3242",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 15,
  },
  sendingText: {
    fontSize: 12,
    color: "#FFFFFFb7",
    fontFamily: "SpaceGrotesk",
  },
  composerInput: {
    padding: 10,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
    flex: 1,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  composerContainer: {
    backgroundColor: "#2f3242",
    minHeight: 50,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: 3,
  },
  sendContainer: {
    marginTop: 10,
    width: 40,
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#2f3242",
  },
  focus: {
    backgroundColor: "#3a3e52",
  },
});
