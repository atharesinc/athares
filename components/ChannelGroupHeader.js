import React from "reactn";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const ChannelGroupHeader = ({
  displayPlus = false,
  title,
  rounded = false,
  onPressPlus = () => {},
}) => {
  return (
    <View style={[styles.row, { borderRadius: rounded ? 4 : 0 }]}>
      <Text style={styles.channelTitle}>{title}</Text>
      {displayPlus ? (
        <TouchableOpacity onPress={onPressPlus}>
          <Feather name="plus" size={20} color={"#282a38"} />
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
    backgroundColor: "#00DFFC",
  },
  channelTitle: {
    color: "#282a38",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "SpaceGrotesk",
  },
});
