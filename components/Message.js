import React, { memo } from "react";
import { StyleSheet, View, Text } from "react-native";
import ImageMessage from "./ImageMessage";
import FileMessage from "./FileMessage";
import AsyncImage from "./AsyncImage";
import MessageDivider from "./MessageDivider";

import { parseDate } from "../utils/transform";

export default memo(function Message({
  message: msg,
  isSameUser,
  isSameDay,
  onLayout = null,
  ...props
}) {
  const timestamp = parseDate(props.timestamp, "h:mm bbbb");

  const isImage = (file) => {
    const imgs = ["gif", "png", "jpg", "jpeg", "bmp"];

    let extension = file.match(/\.(.{1,4})$/i)
      ? file.match(/\.(.{1,4})$/i)[1]
      : "";

    if (imgs.findIndex((i) => i === extension.toLowerCase()) !== -1) {
      return <ImageMessage file={file} fileName={file} />;
    } else {
      return <FileMessage file={file} fileName={file} />;
    }
  };

  const _onLayout = (e) => {
    // Inject the id into the nativeEvent
    e.id = msg.id;
    e.index = props.index;
    return onLayout(e);
  };

  const source = { uri: msg.user.icon };
  return (
    <View onLayout={_onLayout}>
      {isSameDay && (
        <MessageDivider date={parseDate(msg.createdAt, "cccc, LLLL do")} />
      )}
      <View style={styles.messageWrapper}>
        {/* avatar */}
        <View
          style={[
            styles.avatarWrapper,
            isSameUser ? styles.collapseAvatarWrapper : {},
          ]}
        >
          {isSameUser ? (
            <View style={styles.blankWidth} />
          ) : (
            <AsyncImage
              source={source}
              style={[styles.messageAvatar]}
              placeholderColor={"#3a3e52"}
            />
          )}
        </View>

        <View style={styles.nameAndContentColumn}>
          {isSameUser === false ? (
            <View style={styles.userAndTimeWrapper}>
              <Text style={styles.messageUserText}>
                {msg.user.firstName + " " + msg.user.lastName}
              </Text>
              <Text style={styles.timestamp}>{timestamp}</Text>
            </View>
          ) : null}
          {/* <View
          style={[
            styles.messageContentWrapper,
            isMine ? styles.me : styles.otherUser,
          ]}
        > */}
          {msg.text ? <Text style={styles.messageText}>{msg.text}</Text> : null}
          {/* </View> */}
          {msg.file && isImage(msg.file)}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  messageWrapper: {
    // margin: 15,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: "row",
  },
  nameAndContentColumn: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  messageContentWrapper: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
  },
  userAndTimeWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  blankWidth: { width: 30 },

  messageUserText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "SpaceGrotesk",
  },
  avatarWrapper: {
    height: 30,
    width: 30,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  collapseAvatarWrapper: {
    borderWidth: 2,
    height: 0,
    borderColor: "transparent",
  },
  messageAvatar: {
    height: 30,
    width: 30,
  },
  messageText: {
    color: "#FFFFFF",
    paddingVertical: 0,
    paddingHorizontal: 15,
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
