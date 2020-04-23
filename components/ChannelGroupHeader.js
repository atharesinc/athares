import React from "reactn";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import * as RootNavigation from "../navigation/RootNavigation";

const ChannelGroupHeader = ({ displayPlus = false, title, ...props }) => {
  const nav = () => {
    if (title === "DIRECT MESSAGES") {
      props.navigation.navigate("CreateDM");
    } else if (title === "CHANNELS") {
      props.navigation.navigate("CreateChannel");
    }
  };
  return (
    <View style={styles.row}>
      <Text style={styles.channelTitle}>{title}</Text>
      {displayPlus ? (
        <TouchableOpacity onPress={nav}>
          <Feather name="plus" size={25} color={"#FFFFFF"} />
        </TouchableOpacity>
      ) : null}
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
    paddingVertical: 10,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
  },
  channelTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});
