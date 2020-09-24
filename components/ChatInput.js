import React, { useState, useRef } from "reactn";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
  TextInput,
} from "react-native";
import Loader from "./Loader";
import { Feather } from "@expo/vector-icons";
import CustomActions from "./CustomActions";
//maybe not this one
// import { AutoGrowTextInput } from "react-native-auto-grow-textinput";
import TextareaAutosize from "react-autosize-textarea";
import {
  processFile,
  // uploadToAWS
} from "../utils/upload";

export default function ChatInput(props) {
  const [messageState, setMessageState] = useState({
    input: "",
    showFilePreview: false,
    file: null,
    fileIsImage: false,
    loadingImage: false,
  });

  const {
    input,
    showFilePreview,
    file,
    fileIsImage,
    loadingImage,
  } = messageState;

  // const [showEmoji, setShowEmoji] = useState(false);
  // const [rotate, setRotate] = useState(0);
  // const [extension, setExtension] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const submit = () => {
    // send the message to parent
    props.onSend(input, file);
    console.log("am i getting here?");
    setMessageState({
      input: "",
      showFilePreview: false,
      file: null,
      fileIsImage: false,
      loadingImage: false,
    });
  };

  const updateFile = async (uri) => {
    if (!uri) {
      return false;
    }
    setMessageState({
      ...messageState,
      loadingImage: true,
    });
    console.log("updating file in state", uri);

    const preparedFile = processFile({ uri });

    // file.name =
    //   file.name ||
    //   file.uri.substring(file.uri.lastIndexOf("/") + 1, file.uri.length);

    const imgs = [
      "image/gif",
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/bmp",
    ];

    // let extension = file.uri.match(/\.(.{1,4})$/i);

    console.log(
      preparedFile.type,
      imgs.indexOf(preparedFile.type.toLowerCase()) !== -1
    );
    if (imgs.indexOf(preparedFile.type.toLowerCase()) !== -1) {
      setMessageState({
        ...messageState,
        showFilePreview: true,
        file: preparedFile,
        fileIsImage: true,
        loadingImage: false,
      });
      return;
    }
    setMessageState({
      ...messageState,
      showFilePreview: true,
      file: preparedFile,
      fileIsImage: false,
      loadingImage: false,
    });
  };

  const deleteImage = () => {
    setMessageState({
      ...messageState,
      showFilePreview: false,
      file: null,
      fileIsImage: false,
    });
  };

  const shouldRenderImage = () => {
    if (loadingImage) {
      return <Loader size={20} style={{ flex: 0 }} />;
    }
    if (fileIsImage) {
      return <Image style={styles.previewImage} source={{ uri: file.uri }} />;
    }
    return <Feather name="file-text" color={"#FFFFFFb7"} size={20} />;
  };

  const shouldRenderSendButton = () => {
    if (input !== "" || file !== null) {
      return (
        <TouchableOpacity onPress={submit} style={styles.sendContainer}>
          <Feather name="send" size={20} color={"#FFFFFF"} />
        </TouchableOpacity>
      );
    } else {
      // return (
      //   <View style={styles.sendContainer}>
      //     <Feather name="send" size={20} color={"transparent"} />
      //   </View>
      // );
      return null;
    }
  };

  const focusUp = () => {
    setIsFocused(true);
  };
  const focusOff = () => {
    setIsFocused(false);
  };

  const updateInput = (text) => {
    setMessageState({
      ...messageState,
      input: text,
    });
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
          {/* <AutoGrowTextInput
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
          /> */}
          <CrossAutoGrow
            value={input}
            onChangeText={updateInput}
            placeholder={"Enter Message"}
            // placeholderTextColor={"#FFFFFFb7"}
            onFocus={focusUp}
            onBlur={focusOff}
            autoFocus={true}
            isFocused={isFocused}
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
    overflow: "hidden",
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
    // flex: 1,
    paddingHorizontal: 15,
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

function CrossAutoGrow({ onChangeText, value, isFocused = false, ...props }) {
  const inputEl = useRef();

  const _updateTextForWeb = (e) => {
    onChangeText(e.currentTarget.value);
  };

  // useEffect(() => {
  //   // override weird unsetting of max height on web
  //   if (Platform.OS === "web") {
  //     inputEl.current.style.maxHeight = "300px !important";
  //   }
  // }, []);

  if (Platform.OS === "web") {
    const webStyles = {
      padding: 10,
      color: "#FFFFFF",
      fontFamily: "SpaceGrotesk",
      // flex: 1,
      backgroundColor: isFocused ? "#3a3e52" : "transparent",
      border: "none",
      outlineStyle: "none",
      fontSize: "inherit",
      maxHeight: "300px",
      boxSizing: "border-box",
      resize: "none",
      overflow: "hidden",
      overflowWrap: "break-word",
    };

    return (
      <TextareaAutosize
        {...props}
        value={value}
        style={webStyles}
        onChange={_updateTextForWeb}
        maxRows={3}
        ref={inputEl}
      />
    );
  }

  return (
    <TextInput
      multiline={true}
      value={value}
      onChangeText={onChangeText}
      style={[
        styles.composerInput,
        isFocused ? styles.focus : {},
        { maxHeight: 200, paddingHorizontal: 15 },
      ]}
      placeholderTextColor={"#FFFFFFb7"}
      onSubmitEditing={Keyboard.dismiss}
      {...props}
    />
  );
}
