import React from "reactn";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import * as RootNavigation from "../../navigation/RootNavigation";

const ChannelGroupHeader = ({ displayPlus = false, title, ...props }) => {
  const nav = () => {
    // if (title === "DIRECT MESSAGES") {
    //   RootNavigation.navigate("c");
    // } else
    if (title === "CHANNELS") {
      RootNavigation.navigate("createChannel");
    }
  };
  return (
    <View style={styles.row}>
      <Text style={styles.channelTitle}>{title}</Text>
      {displayPlus ? (
        <TouchableOpacity onPress={nav}>
          <Feather name="plus" size={20} color={"#FFFFFF"} />
        </TouchableOpacity>
      ) : (
        <Feather name="circle" size={20} color={"transparent"} />
      )}
    </View>
  );
};

export default ChannelGroupHeader;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#3a3e52",
  },
  channelTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "SpaceGrotesk",
  },
});
