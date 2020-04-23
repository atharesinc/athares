import React, { useGlobal } from "reactn";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as RootNavigation from "../navigation/RootNavigation";

const ChannelItem = ({
  channel = { name: "", channelType: "group" },
  lastMessage = null,
  showUnread = false,
  ...props
}) => {
  const [activeChannel, setActiveChannel] = useGlobal("activeChannel");

  const nav = () => {
    setActiveChannel(channel.id);

    if (channel.channelType === "dm") {
      RootNavigation.navigate("DMChannel");
    } else if (channel.channelType === "group") {
      RootNavigation.navigate("Channel");
    }
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
      {showUnread && (
        <Feather
          styleName="disclosure"
          name="alert-circle"
          size={25}
          color={"#00dffc"}
        />
      )}
    </TouchableOpacity>
  );
};

export default ChannelItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    width: "100%",
    paddingVertical: 15,
  },
  channelTitle: {
    color: "#FFFFFF80",
    fontSize: 20,
  },
  channelText: {
    color: "#FFFFFF80",
    fontSize: 15,
    maxWidth: "90%",
  },
  unread: {
    color: "#FFF",
  },
});
