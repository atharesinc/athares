import React from "react";
import { StyleSheet, View, Text } from "react-native";
import ImageMessage from "./ImageMessage";
import FileMessage from "./FileMessage";
import AsyncImage from "./AsyncImage";
import FadeInView from "./FadeInView";
import { parseDate } from "../utils/transform";

const Message = ({ message: msg, isMine, multiMsg, ...props }) => {
  const timestamp = parseDate(props.timestamp, "h:mm bbbb");

  const isImage = (file, fileName) => {
    const imgs = ["gif", "png", "jpg", "jpeg", "bmp"];

    let extension = fileName.match(/\.(.{1,4})$/i)
      ? fileName.match(/\.(.{1,4})$/i)[1]
      : "";

    if (imgs.findIndex((i) => i === extension.toLowerCase()) !== -1) {
      return <ImageMessage file={file} fileName={fileName} />;
    } else {
      return <FileMessage file={file} fileName={fileName} />;
    }
  };

  return (
    <FadeInView style={styles.messageWrapper}>
      <View style={styles.userAndTimeWrapper}>
        {multiMsg === false && (
          <>
            <Text style={styles.messageUserText}>
              {msg.user.firstName + " " + msg.user.lastName}
            </Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </>
        )}
      </View>
      <View style={styles.messageAvatarAndContentWrapper}>
        {multiMsg === false ? (
          <View style={styles.avatarWrapper}>
            <AsyncImage
              source={{ uri: msg.user.icon }}
              style={styles.messageAvatar}
              placeholderColor={"#3a3e52"}
            />
          </View>
        ) : null}
        <View
          style={[
            styles.messageContentWrapper,
            isMine ? styles.me : styles.otherUser,
          ]}
        >
          {msg.text ? <Text style={styles.messageText}>{msg.text}</Text> : null}
        </View>
      </View>
      {msg.file && isImage(msg.file)}
    </FadeInView>
  );
};

export default Message;

const styles = StyleSheet.create({
  messageAvatarAndContentWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  messageContentWrapper: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: 3,
    flex: 1,
  },
  userAndTimeWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  me: {
    backgroundColor: "#2f3242",
  },
  otherUser: {
    backgroundColor: "#3a3e52",
  },
  messageWrapper: {
    margin: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  messageUserText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "SpaceGrotesk",
  },
  avatarWrapper: {
    height: 40,
    width: 40,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  messageAvatar: {
    height: 40,
    width: 40,
  },
  messageText: {
    color: "#FFFFFF",
    padding: 15,
    borderRadius: 3,
    fontFamily: "SpaceGrotesk",
    fontSize: 15,
  },
  timestamp: {
    color: "#FFFFFFb7",
    fontSize: 12,
    marginLeft: 10,
    fontFamily: "SpaceGrotesk",
  },
});
