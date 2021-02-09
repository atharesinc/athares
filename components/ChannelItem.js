import React, { useGlobal } from "reactn";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as RootNavigation from "../navigation/RootNavigation";

export default function ChannelItem({
  channel = { name: "", channelType: "group" },
  lastMessage = null,
  showUnread = false,
}) {
  const [, setActiveChannel] = useGlobal("activeChannel");
  const [activeCircle] = useGlobal("activeCircle");

  const nav = () => {
    setActiveChannel(channel.id, () => {
      if (channel.channelType === "group") {
        RootNavigation.navigate("channel", {
          channel: channel.id,
          circle: activeCircle,
        });
      }
    });
  };
  return (
    <TouchableOpacity style={styles.row} onPress={nav}>
      <View styleName="vertical">
        <Text style={[styles.channelTitle, showUnread ? styles.unread : {}]}>
          {channel.name || "General"}
        </Text>
        {lastMessage && (
          <Text
            style={[styles.channelText, showUnread ? styles.unread : {}]}
            numberOfLines={1}
          >
            {lastMessage.user.firstName + ": " + lastMessage.text}
          </Text>
        )}
      </View>
      {showUnread && <View style={styles.unreadIndicator}></View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    width: "100%",
    paddingVertical: 10,
  },
  channelTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGrotesk",
  },
  channelText: {
    color: "#FFFFFF80",
    fontSize: 12,
    maxWidth: "90%",
    fontFamily: "SpaceGrotesk",
  },
  unread: {
    color: "#00DFFC",
  },
  unreadIndicator: {
    backgroundColor: "#00DFFC",
    height: 12,
    width: 12,
    borderRadius: 9999,
  },
});
